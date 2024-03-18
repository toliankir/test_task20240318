import { ArticleEntity } from 'src/database/entity/article.entity';

export class ArticleDtoResponse {
  id: number;
  email: string;
  title: string;
  text: string;

  public static fromEntity(entity: ArticleEntity) {
    return {
      id: entity.id,
      email: entity.user.email,
      title: entity.title,
      text: entity.text,
    };
  }
}
