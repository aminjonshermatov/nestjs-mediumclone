import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArticleController } from "@app/article/article.controller";
import { ArticleService } from "@app/article/article.service";
import { ArticleEntity } from "@app/article/article.entity";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/profile/follow.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule { }
