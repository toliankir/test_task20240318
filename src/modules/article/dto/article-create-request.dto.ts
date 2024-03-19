import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ArticleCreateDtoRequest {
  @ApiProperty({ example: 'Article title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Article text' })
  @IsString()
  text: string;
}
