import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';

export interface IAddPriceHistory {
	productId: number,
	provider: ProvidersEnum,
	oldPrice: number,
	newPrice: number,
	oldAvailability: boolean,
	newAvailability: boolean,
	timestamp: Date
}