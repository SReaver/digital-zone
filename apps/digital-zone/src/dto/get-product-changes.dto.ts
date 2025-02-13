import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProductChangesDto {
	@ApiProperty({
		example: new Date(),
		description: 'Start date',
		type: Date
	})
	@IsNotEmpty()
	@Transform(({ value }) => new Date(value))
	@IsDate()
	startDate: Date;

	@ApiProperty({
		example: new Date(),
		description: 'End date',
		type: Date
	})
	@IsNotEmpty()
	@Transform(({ value }) => new Date(value))
	@IsDate()
	endDate: Date;
}
