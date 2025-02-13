import { IExtendedProduct } from "@app/shared";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductDto implements IExtendedProduct {
    @ApiProperty({ type: Number, example: 1, description: 'Unique identifier of the product' })
    id: number;
    @ApiProperty({ type: String, example: 'Product name', description: 'Name of the product' })
    name: string;
    @ApiPropertyOptional({ type: String, example: 'Product description', description: 'Description of the product' })
    description?: string | undefined | null;
    @ApiProperty({ type: Number, example: 9.99, description: 'Price of the product' })
    price: number;
    @ApiProperty({ type: String, example: 'USD', description: 'Currency of the price' })
    currency: string;
    @ApiProperty({ type: Date, example: new Date(), description: 'Date of the last update' })
    lastUpdated: Date;
    @ApiProperty({ type: String, example: 'Category', description: 'Category of the product' })
    category: string;
    @ApiProperty({ type: Number, example: 10, description: 'Stock of the product' })
    stock: number;
    @ApiPropertyOptional({ type: Number, example: 5, description: 'Rating of the product' })
    rating?: number | null;
}
