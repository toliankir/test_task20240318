import { IntersectionType } from '@nestjs/swagger';
import { ArticleDtoRequest } from './article-request.dto';
import { ArticleCreateDtoRequest } from './article-create-request.dto';

export class ArticleUpdateDtoRequest extends IntersectionType(
  ArticleCreateDtoRequest,
  ArticleDtoRequest,
) {}
