import { ArticleType } from "@app/article/types/article.type";

export class ArticlesResponseInterface {
  articles: ArticleType[];
  articlesCount: number;
}
