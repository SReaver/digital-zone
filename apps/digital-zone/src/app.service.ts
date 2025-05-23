import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { catchError, retry, map } from 'rxjs/operators';
import { forkJoin, throwError, lastValueFrom } from 'rxjs';

import { isValidUrl } from './utils';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';
import {
  IAddPersistedProduct,
  IPersistedExtendedProduct,
  IPersistedProduct,
} from './factories/product-class.interface';
import { AppRepository } from './app.repository';
import { createProduct } from './factories/product.factory';
import { isExtendedProduct } from '@app/shared';
import { ProductUpdatesService } from './events/product-updates.service';

const STALE_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

interface Provider {
  name: ProvidersEnum;
  url: string;
}

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout;

  constructor(
    private httpService: HttpService,
    private appRepository: AppRepository,
    private configService: ConfigService,
    private productUpdatesService: ProductUpdatesService,
  ) { }

  onModuleInit() {
    const interval = this.configService.get<number>(
      'DATA_FETCH_INTERVAL',
      5000,
    );

    this.intervalId = setInterval(() => {
      this.getDataFromProviders();
    }, interval);
    this.intervalId.unref(); // Ensure the interval does not keep the process alive
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async fetchData(
    providers: Provider[],
  ): Promise<(IPersistedProduct | IPersistedExtendedProduct)[]> {
    if (!providers || !providers.length)
      throw new BadRequestException('No providers provided');

    // validate urls
    providers.forEach((provider) => {
      if (!isValidUrl(provider.url)) {
        throw new BadRequestException(`Invalid URL: ${provider.url}`);
      }
    });

    const requests = providers.map((provider) =>
      this.httpService.get(provider.url).pipe(
        retry(3),
        catchError((error) => {
            console.error(
              `Error fetching data from ${provider.url}:`,
              error.message,
            );

          return throwError(error);
        }),
        map((response) => {
          if (response) {
            return response.data.map((product) => ({
              ...product,
              provider: provider.name,
            }));
          }
        }),
      ),
    );

    return await lastValueFrom(forkJoin(requests))
      .then((responses) => responses.flat())
      .catch((error) => {
        console.error('Error fetching data:', error.message);
        return [];
      });
  }

  async getDataFromProviders() {
    const providers: Provider[] = [
      {
        name: ProvidersEnum.providerOne,
        url: 'http://provider-one:3001/products',
      },
      {
        name: ProvidersEnum.providerTwo,
        url: 'http://provider-two:3002/products',
      },
      {
        name: ProvidersEnum.providerThree,
        url: 'http://provider-three:3003/products',
      },
    ];
    const data = await this.fetchData(providers);
    const preparedData = this.prepareDataToSave(data);
    const savedProducts = await Promise.all(
      preparedData.map((product) => this.compareAndUpdateProduct(product)),
    );

    if (savedProducts.length > 0) {
      this.productUpdatesService.emitProductUpdates(savedProducts);
    }
  }

  async compareAndUpdateProduct(
    product: IAddPersistedProduct | IPersistedExtendedProduct,
  ): Promise<IPersistedProduct> {
    let availability: boolean = false;
    if (isExtendedProduct(product)) {
      availability = Boolean(product.stock);
    } else {
      availability = product.availability;
    }

    const productToUpsert = {
      ...product,
      productId: product.id,
      lastUpdated: new Date(),
    };

    const existingProduct = await this.appRepository.findProductByIdAndProvider(
      product.id,
      product.provider,
    );
    if (existingProduct) {
      if (
        existingProduct.price !== product.price ||
        existingProduct.availability !== availability
      ) {
        await this.appRepository.addPriceHistory({
          productId: product.id,
          provider: product.provider,
          oldPrice: existingProduct.price,
          newPrice: product.price,
          oldAvailability: existingProduct.availability,
          newAvailability: availability,
          timestamp: new Date(),
        });
      }
    }
    return await this.appRepository.upsertProduct(productToUpsert);
  }

  private prepareDataToSave(
    data: (IPersistedProduct | IPersistedExtendedProduct)[],
  ): IAddPersistedProduct[] {
    const result: IAddPersistedProduct[] = [];
    for (const product of data) {
      const productClass = createProduct(product);
      const cls = productClass.toPersistence();
      result.push(cls);
    }
    return result;
  }

  async getProducts(filters: any) {
    return await this.appRepository.findProducts(filters);
  }

  async findAllProducts(): Promise<IPersistedProduct[]> {
    return await this.appRepository.findAllProducts();
  }

  async getProductById(id: number) {
    const product = await this.appRepository.findProductById(id);
    if (!product) throw new BadRequestException('Product not found');
    const priceHistory =
      await this.appRepository.findPriceHistoryByProductId(id);
    return { ...product, priceHistory };
  }

  async getProductsChanges(startDate: Date, endDate: Date) {
    return this.appRepository.findProductsWithChanges(startDate, endDate);
  }

  async getStaleProducts() {
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS);
    return this.appRepository.findStaleProducts(staleThreshold);
  }

  @Interval('checkStaleProducts', 3600000) // Check every hour
  async handleStaleProducts() {
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_MS);
    await this.appRepository.markStaleProducts(staleThreshold);
  }
}
