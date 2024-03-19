import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class ArticlePaginationDtoRequest {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsPositive()
  @Max(25)
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: 2, required: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;
}
