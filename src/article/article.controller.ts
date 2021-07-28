import {
  Get,
  Put,
  Body,
  Post,
  Query,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  Controller
} from "@nestjs/common";

import { ArticleService } from "@app/article/article.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/entities/user.entity";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";
import { ArticleListQueryDto } from "@app/article/dto/articleListQuery.dto";
import { FeedArticlesDto } from "@app/article/dto/feedArticles.dto";
import { CreateCommentDto } from "@app/article/dto/createComment.dto";
import { CommentResponseInterface } from "@app/article/types/commentResponse.interface";
import { CommentsResponseInterface } from "@app/article/types/commentsResponse.interface";

@Controller('articles')
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService
  ) { }

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: ArticleListQueryDto
  ): Promise<ArticlesResponseInterface> {
    return this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: FeedArticlesDto
  ): Promise<ArticlesResponseInterface> {
    return this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string
  ) {
    return this.articleService.deleteArticle(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(slug, updateArticleDto, currentUserId);
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.deleteArticleFromFavorites(slug, currentUserId);
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async addComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto
  ): Promise<CommentResponseInterface> {
    return await this.articleService.addComment(currentUserId, slug, createCommentDto);
  }

  @Get(':slug/comments')
  async getCommentsFromArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string
  ): Promise<CommentsResponseInterface> {
    return this.articleService.getComments(currentUserId, slug);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(AuthGuard)
  async deleteCommentFromArticle(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Param('id') commentId: number
  ) {
    return this.articleService.deleteCommentFromArticle(currentUser, slug, commentId);
  }
}
