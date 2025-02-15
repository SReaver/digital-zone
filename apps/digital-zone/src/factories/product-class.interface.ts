import { IExtendedProduct, IGeneralProduct } from '@app/shared';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';

export interface IProductClass {
	toPersistence(): IAddPersistedProduct;
}

export interface IPersistedProduct extends IGeneralProduct {
	provider: ProvidersEnum;
	productId: number;
	isStale: boolean;
}
export interface IPersistedExtendedProduct extends IExtendedProduct {
	provider: ProvidersEnum;
	productId: number;
}

export type IAddPersistedProduct = Omit<IPersistedProduct, 'isStale'>;
