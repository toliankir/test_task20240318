import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class ArticlePaginationDtoRequest {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsPositive()
  @Max(25)
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: 2, required: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  offset?: number;
}
