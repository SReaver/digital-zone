export interface GeneralProduct {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    availability: boolean;
    lastUpdated: Date;
}

export interface ExtendedProduct extends Omit<GeneralProduct, 'availability'> {
    category: string;
    stock: number;
    rating?: number | null;
}