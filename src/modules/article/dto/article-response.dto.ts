import { ApiProperty } from '@nestjs/swagger';
import { ArticleEntity } from '../../../database/entity/article.entity';

export class ArticleDtoResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@mail.com' })
  email: string;

  @ApiProperty({ example: 'Test title' })
  title: string;

  @ApiProperty({ example: 'Test text' })
  text: string;

  public static fromEntity(entity: ArticleEntity): ArticleDtoResponse {
    return {
      id: entity.id,
      email: entity.user.email,
      title: entity.title,
      text: entity.text,
    };
  }
}
