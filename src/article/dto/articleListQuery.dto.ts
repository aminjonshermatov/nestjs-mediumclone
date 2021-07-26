import { IsOptional } from "class-validator";

export class ArticleListQueryDto {
  @IsOptional()
  readonly tag: string;

  @IsOptional()
  readonly author: string;

  @IsOptional()
  readonly favorited: string;

  @IsOptional()
  readonly limit: string;

  @IsOptional()
  readonly offset: string;
}
