import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class ArticleDtoRequest {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsPositive()
  id: number;
}
