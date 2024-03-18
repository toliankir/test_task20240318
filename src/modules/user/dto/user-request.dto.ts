import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class UserDtoRequest {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsPositive()
  id: number;
}
