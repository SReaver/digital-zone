import { InternalServerErrorException } from '@nestjs/common';

import { isExtendedProduct, isGeneralProduct } from '@app/shared';
import { IPersistedExtendedProduct, IPersistedProduct, IProductClass } from './product-class.interface';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';

export class PersistedProductClass implements IPersistedProduct, IProductClass {
	id: number;
	name: string;
	description?: string | null;
	price: number;
	currency: string;
	availability: boolean;
	lastUpdated: Date;
	provider: ProvidersEnum;

	constructor(
		id: number,
		name: string,
		description: string | null,
		price: number,
		currency: string,
		availability: boolean,
		lastUpdated: Date,
		provider: ProvidersEnum,
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.currency = currency;
		this.availability = availability;
		this.lastUpdated = lastUpdated;
		this.provider = provider;
	}

	toPersistence() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			currency: this.currency,
			availability: this.availability,
			lastUpdated: this.lastUpdated,
			provider: this.provider,
		};
	}
}

export class PersistedExtendedProductClass implements IPersistedExtendedProduct, IProductClass {
	id: number;
	name: string;
	description?: string | null;
	price: number;
	currency: string;
	lastUpdated: Date;
	category: string;
	stock: number;
	rating?: number | null;
	provider: ProvidersEnum

	constructor(
		id: number,
		name: string,
		description: string | null,
		price: number,
		currency: string,
		lastUpdated: Date,
		category: string,
		stock: number,
		rating: number | null,
		provider: ProvidersEnum
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.currency = currency;
		this.lastUpdated = lastUpdated;
		this.category = category;
		this.stock = stock;
		this.rating = rating;
		this.provider = provider;
	}

	toPersistence() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			currency: this.currency,
			lastUpdated: this.lastUpdated,
			availability: this.stock > 0,
			provider: this.provider,
		};
	}
}

export function createProduct(data: IPersistedProduct | IPersistedExtendedProduct): PersistedProductClass | PersistedExtendedProductClass {
	switch (true) {
		case isGeneralProduct(data):
			return new PersistedProductClass(
				data.id,
				data.name,
				data.description ?? null,
				data.price,
				data.currency,
				data.availability,
				data.lastUpdated,
				data.provider
			);

		case isExtendedProduct(data):
			return new PersistedExtendedProductClass(
				data.id,
				data.name,
				data.description ?? null,
				data.price,
				data.currency,
				data.lastUpdated,
				data.category,
				data.stock,
				data.rating ?? null,
				data.provider
			);

		default:
			throw new InternalServerErrorException('Can not create product - Invalid product type');
	}
}
