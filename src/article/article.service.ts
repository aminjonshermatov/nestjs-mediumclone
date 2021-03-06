import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";

import slugify from 'slugify';

import { UserEntity } from "@app/user/entities/user.entity";
import { ArticleEntity } from "@app/article/entities/article.entity";
import { FollowEntity } from "@app/profile/entities/follow.entity";
import { CreateArticleDto } from "@app/article/dto/createArticle.dto";
import { ArticleResponseInterface } from "@app/article/types/articleResponse.interface";
import { ArticlesResponseInterface } from "@app/article/types/articlesResponse.interface";
import { ArticleListQueryDto } from "@app/article/dto/articleListQuery.dto";
import { FeedArticlesDto } from "@app/article/dto/feedArticles.dto";
import { CreateCommentDto } from "@app/article/dto/createComment.dto";
import { CommentResponseInterface } from "@app/article/types/commentResponse.interface";
import { CommentEntity } from "@app/article/entities/comment.entity";
import { CommentsResponseInterface } from "@app/article/types/commentsResponse.interface";
import { CommentType } from "@app/article/types/comment.type";

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>
  ) { }

  async findAll(currentUserId: number, query: ArticleListQueryDto): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({ username: query.author });

      if (author) {
        queryBuilder.andWhere(`articles.authorId = :id`, { id: author.id });
      } else {
        queryBuilder.andWhere(`1=0`);
      }
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        username: query.favorited
      }, { relations: ['favorites'] });

      const ids = (author || { favorites: [] }).favorites.map(favoriteArticle => favoriteArticle.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    if (query.limit) {
      queryBuilder.limit(+query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(+query.offset);
    }

    let favoriteIds: number[] = [];
    let followingIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne(currentUserId, { relations: ['favorites'] });

      favoriteIds = (currentUser || { favorites: [] }).favorites.map(favoriteArticle => favoriteArticle.id);

      const followings = await this.followRepository.find({ followerId: currentUserId }) || [];
      followingIds = followings.map(following => following.followingId);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = (articles || []).map(article => {
      const favorited = favoriteIds.includes(article.id);
      const following = followingIds.includes(article.author.id);
      delete article.author.id;
      delete article.author.email;
      return { ...article, author: { ...article.author, following }, favorited };
    });

    return { articles: articlesWithFavorites, articlesCount };
  }

  async getFeed(currentUserId: number, query: FeedArticlesDto): Promise<ArticlesResponseInterface> {
    const follows = await this.followRepository.find({
      followerId: currentUserId
    });

    if ((follows || []).length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserIds = (follows || []).map(follow => follow.followingId);

    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(+query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(+query.offset);
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    delete article.author.id;

    return { article };
  }

  private getSlug(title: string): string {
    return slugify(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You  are not author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(slug: string, updateArticleDto: CreateArticleDto, currentUserId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    article.slug = this.getSlug(updateArticleDto.title);
    Object.assign(article, updateArticleDto);

    return this.articleRepository.save(article);
  }

  async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites']
    });

    const isNotFavorited = (user).favorites.findIndex(
      favorite => favorite.id === article.id
    ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!slug) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne(currentUserId, {
      relations: ['favorites']
    });

    const articleIndex = user.favorites.findIndex(
      favorite => favorite.id === article.id
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoritesCount--;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async addComment(currentUserId: number, slug: string, createCommentDto: CreateCommentDto): Promise<CommentResponseInterface> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Couldn`t find article', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne(currentUserId);

    const comment = new CommentEntity();
    Object.assign(comment, createCommentDto);

    comment.author = user;
    comment.article = article;

    const savedComment = await this.commentRepository.save(comment);
    delete savedComment.article;
    delete savedComment.author.id;
    delete savedComment.author.email;

    savedComment.author['following'] = true;

    return { comment: savedComment };
  }

  async getComments(currentUserId: number, slug: string): Promise<CommentsResponseInterface> {
    const article = await this.articleRepository.findOne({ slug }, { relations: ['comments'] });

    if (!slug) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    let comments: CommentType[] = article.comments || [];

    if (currentUserId) {
      const followings = await this.followRepository.find({ followerId: currentUserId }) || [];

      comments = comments.map(
        comment => {
          delete comment.author.id;
          delete comment.author.email;

          return followings.findIndex(following => following.followingId === comment.id) === -1
            ? { ...comment, author: { ...comment.author, following: false } }
            : { ...comment, author: { ...comment.author, following: true } };
        }
      );
    }

    return { comments };
  }

  async deleteCommentFromArticle(currentUser: UserEntity, slug: string, commentId: number) {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findOne({ article, author: currentUser, id: commentId });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return await this.commentRepository.remove(comment);
  }
}
