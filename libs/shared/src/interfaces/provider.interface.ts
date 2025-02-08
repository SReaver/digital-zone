export interface GeneralProduct {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    availability: boolean;
    lastUpdated: Date;
}

export interface ExtendedProduct extends GeneralProduct {
    category: string;
    stock: number;
    rating?: number;
}