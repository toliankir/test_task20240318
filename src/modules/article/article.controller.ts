import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { UserRole } from '../user/types/user-role.enum';
import { ArticleService } from './article.service';
import { User } from '../user/types/user';
import { ArticleDtoResponse } from './dto/article-response.dto';
import { ArticlePaginationDtoRequest } from './dto/article-pagination-request.dto';
import { ArticleCreateDtoRequest } from './dto/article-create-request.dto';
import { ArticleActionDtoResponse } from './dto/article-action-response.dto';
import { ArticleDtoRequest } from './dto/article-request.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async getArticles(
    @Query() pagination: ArticlePaginationDtoRequest,
  ): Promise<ArticleDtoResponse[]> {
    return this.articleService.getArticles(
      pagination.offset || 0,
      pagination.limit || 25,
    );
  }

  @Roles([UserRole.editor])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async createArticle(
    @GetUser() user: User,
    @Body() data: ArticleCreateDtoRequest,
  ): Promise<ArticleActionDtoResponse> {
    return this.articleService.createArticle(user.id, data);
  }

  @Roles([UserRole.admin, UserRole.editor, UserRole.viewer])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getArticle(
    @Param() data: ArticleDtoRequest,
  ): Promise<ArticleDtoResponse> {
    return this.articleService.getArticle(data.id);
  }

  @Roles([UserRole.editor])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  public async updateArticle(
    @GetUser() user: User,
    @Param() article: ArticleDtoRequest,
    @Body() data: ArticleCreateDtoRequest,
  ): Promise<ArticleActionDtoResponse> {
    const updated: boolean = await this.articleService.updateArticle(
      user.id,
      article.id,
      data,
    );

    return {
      id: updated ? article.id : null,
    };
  }

  @Roles([UserRole.admin, UserRole.editor])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async deleteArticle(
    @GetUser() user: User,
    @Param() article: ArticleDtoRequest,
  ) {
    const deleted: boolean = await this.articleService.deleteArticle(
      user,
      article.id,
    );

    return {
      id: deleted ? article.id : null,
    };
  }
}