import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsString({ each: true })
  readonly tagList? : string[];
}
