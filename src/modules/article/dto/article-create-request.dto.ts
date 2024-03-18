import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ArticleCreateDtoRequest {
  @ApiProperty({ example: 'Article title' })
  @IsString()
  @IsEmail()
  title: string;

  @ApiProperty({ example: 'Article text' })
  @IsString()
  text: string;
}
