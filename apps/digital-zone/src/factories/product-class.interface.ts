import { IExtendedProduct, IGeneralProduct } from '@app/shared';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';

export interface IProductClass {
	toPersistence(): IPersistedProduct;
}

export interface IPersistedProduct extends IGeneralProduct { provider: ProvidersEnum };
export interface IPersistedExtendedProduct extends IExtendedProduct { provider: ProvidersEnum };