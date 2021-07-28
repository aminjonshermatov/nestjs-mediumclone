import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleController } from "@app/article/article.controller";
import { ArticleService } from "@app/article/article.service";
import { ArticleEntity } from "@app/article/entities/article.entity";
import { UserEntity } from "@app/user/entities/user.entity";
import { FollowEntity } from "@app/profile/entities/follow.entity";
import { CommentEntity } from "@app/article/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([
    ArticleEntity,
    UserEntity,
    FollowEntity,
    CommentEntity
  ])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule { }
