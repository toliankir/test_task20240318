import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ArticleEntity } from '../../database/entity/article.entity';
import { ArticleDtoResponse } from './dto/article-response.dto';
import { ArticleCreateDtoRequest } from './dto/article-create-request.dto';
import { User } from '../user/types/user';
import { ArticleActionDtoResponse } from './dto/article-action-response.dto';
import { UserRole } from '../user/types/user-role.enum';
import { ArticleUpdateDtoRequest } from './dto/article-update-request.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  public async getArticles(
    offset: number,
    limit: number,
  ): Promise<ArticleDtoResponse[]> {
    const articles: ArticleEntity[] = await this.articleRepository.find({
      skip: offset,
      take: limit,
      relations: ['user'],
      order: {
        id: 'ASC',
      },
    });

    return articles.map((e) => ArticleDtoResponse.fromEntity(e));
  }

  public async getArticle(id: number): Promise<ArticleDtoResponse> {
    const article: ArticleEntity = await this.articleRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });

    return ArticleDtoResponse.fromEntity(article);
  }

  public async createArticle(
    userId: number,
    data: ArticleCreateDtoRequest,
  ): Promise<ArticleActionDtoResponse> {
    const newArticle: DeepPartial<ArticleEntity> = {
      title: data.title,
      text: data.text,
      userId,
    };

    const createdArticle = await this.articleRepository.save(newArticle);

    return {
      id: createdArticle.id,
    };
  }

  public async updateArticle(
    userId: number,
    data: ArticleUpdateDtoRequest,
  ): Promise<boolean> {
    const updateArticle: DeepPartial<ArticleEntity> = {
      title: data.title,
      text: data.text,
    };
    const updateResult = await this.articleRepository.update(
      {
        id: data.id,
        userId,
      },
      updateArticle,
    );

    return updateResult.affected > 0;
  }

  public async deleteArticle(user: User, articleId: number): Promise<boolean> {
    if (user.roles[0] === UserRole.admin) {
      const deleteResult = await this.articleRepository.delete({
        id: articleId,
      });

      return deleteResult.affected > 0;
    }

    const deleteResult = await this.articleRepository.delete({
      id: articleId,
      userId: user.id,
    });

    return deleteResult.affected > 0;
  }
}
