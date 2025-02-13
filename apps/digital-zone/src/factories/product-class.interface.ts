import { IGeneralProduct } from '@app/shared';

export interface IProductClass {
	toPersistence(): IGeneralProduct;
}
