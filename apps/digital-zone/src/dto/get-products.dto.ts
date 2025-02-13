import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductsQueryDto {
	@ApiPropertyOptional({ description: 'Name of the product', example: 'Advanced Python Course' })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ description: 'Minimum price of the product', example: 10 })
	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@IsPositive()
	minPrice?: number;

	@ApiPropertyOptional({ description: 'Maximum price of the product', example: 50 })
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => parseFloat(value))
	@IsPositive()
	maxPrice?: number;

	@ApiPropertyOptional({ description: 'Availability of the product', example: true })
	@IsOptional()
	@Transform(({ value }) => { if (value === 'true') return true; if (value === 'false') return false; })
	@IsBoolean()
	availability?: boolean;

	@ApiPropertyOptional({ description: 'Provider of the product', example: ProvidersEnum.providerOne, enum: ProvidersEnum })
	@IsOptional()
	@IsEnum(ProvidersEnum)
	provider?: ProvidersEnum;
}