import { InternalServerErrorException } from '@nestjs/common';

import { IExtendedProduct, IGeneralProduct, isExtendedProduct, isGeneralProduct } from '@app/shared';
import { IProductClass } from './product-class.interface';

export class GeneralProductClass implements IGeneralProduct, IProductClass {
	id: number;
	name: string;
	description?: string | null;
	price: number;
	currency: string;
	availability: boolean;
	lastUpdated: Date;

	constructor(
		id: number,
		name: string,
		description: string | null,
		price: number,
		currency: string,
		availability: boolean,
		lastUpdated: Date
	) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.currency = currency;
		this.availability = availability;
		this.lastUpdated = lastUpdated;
	}

	toPersistence(): IGeneralProduct {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			currency: this.currency,
			availability: this.availability,
			lastUpdated: this.lastUpdated
		};
	}
}

export class ExtendedProductClass implements IExtendedProduct, IProductClass {
	id: number;
	name: string;
	description?: string | null;
	price: number;
	currency: string;
	lastUpdated: Date;
	category: string;
	stock: number;
	rating?: number | null;

	constructor(
		id: number,
		name: string,
		description: string | null,
		price: number,
		currency: string,
		lastUpdated: Date,
		category: string,
		stock: number,
		rating: number | null
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
	}

	toPersistence(): IGeneralProduct {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			price: this.price,
			currency: this.currency,
			lastUpdated: this.lastUpdated,
			availability: this.stock > 0,
		};
	}
}

export function createProduct(data: IGeneralProduct | IExtendedProduct): GeneralProductClass | ExtendedProductClass {
	switch (true) {
		case isGeneralProduct(data):
			return new GeneralProductClass(
				data.id,
				data.name,
				data.description ?? null,
				data.price,
				data.currency,
				data.availability,
				data.lastUpdated
			);

		case isExtendedProduct(data):
			return new ExtendedProductClass(
				data.id,
				data.name,
				data.description ?? null,
				data.price,
				data.currency,
				data.lastUpdated,
				data.category,
				data.stock,
				data.rating ?? null
			);

		default:
			throw new InternalServerErrorException('Can not create product - Invalid product type');
	}
}
