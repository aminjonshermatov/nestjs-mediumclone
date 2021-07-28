import { ArticleEntity } from "@app/article/entities/article.entity";
import { UserEntity } from "@app/user/entities/user.entity";

export type ArticleType = Omit<ArticleEntity, 'updateTimestamp' | 'author'> & { author: Omit<UserEntity, 'hashPassword' | 'id' | 'email'> };
