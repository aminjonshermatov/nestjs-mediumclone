import { IsOptional } from "class-validator";

export class FeedArticlesDto {
  @IsOptional()
  readonly limit: string;

  @IsOptional()
  readonly offset: string;
}
