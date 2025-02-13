export interface IGeneralProduct {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    availability: boolean;
    lastUpdated: Date;
}

export interface IExtendedProduct extends Omit<IGeneralProduct, 'availability'> {
    category: string;
    stock: number;
    rating?: number | null;
}

export function isGeneralProduct(product: any): product is IGeneralProduct {
    return product && typeof product.availability === 'boolean';
}

export function isExtendedProduct(product: any): product is IExtendedProduct {
    return product && typeof product.stock === 'number';
}