import {
  Column,
  Entity,
  ManyToOne,
  BeforeUpdate,
  PrimaryGeneratedColumn
} from "typeorm";

import { ArticleEntity } from "@app/article/entities/article.entity";
import { UserEntity } from "@app/user/entities/user.entity";

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => ArticleEntity, article => article.comments)
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, user => user.comments, { eager: true })
  author: UserEntity;
}
