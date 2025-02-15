import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { IPersistedProduct } from '../factories/product-class.interface';

@Injectable()
export class ProductUpdatesService {
	private productUpdates = new Subject<IPersistedProduct[]>();

	getProductUpdates() {
		return this.productUpdates.asObservable();
	}

	emitProductUpdates(products: IPersistedProduct[]) {
		this.productUpdates.next(products);
	}
}
