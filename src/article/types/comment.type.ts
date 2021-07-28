import { CommentEntity } from "@app/article/entities/comment.entity";
import { UserEntity } from "@app/user/entities/user.entity";

export type CommentType = Omit<CommentEntity, 'updateTimestamp' | 'author'> & { author: Omit<UserEntity, 'hashPassword'> };
