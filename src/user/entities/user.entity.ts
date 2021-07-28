import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  ManyToMany,
  BeforeInsert,
  PrimaryGeneratedColumn
} from "typeorm";
import { hash } from 'bcrypt';

import { ArticleEntity } from "@app/article/entities/article.entity";
import { CommentEntity } from "@app/article/entities/comment.entity";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, comment => comment.author)
  comments: CommentEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];
}
