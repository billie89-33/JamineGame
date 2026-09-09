import { CreateArticleDto as SharedCreateArticleDto, ArticleType } from '@shared/dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class CreateArticleDto extends SharedCreateArticleDto {
  @IsString()
  @IsNotEmpty()
  declare title: string;

  @IsString()
  @IsNotEmpty()
  declare excerpt: string;

  @IsString()
  @IsNotEmpty()
  declare content: string;

  @IsString()
  @IsOptional()
  declare coverImage?: string;

  @IsString()
  @IsOptional()
  declare heroImage?: string;

  @IsString()
  @IsOptional()
  declare videoUrl?: string;

  @IsString()
  @IsOptional()
  declare categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  declare tags: string[];

  @IsEnum(ArticleType)
  @IsOptional()
  declare articleType?: ArticleType;

  @IsBoolean()
  @IsOptional()
  declare isFeatured?: boolean;
}

import { PartialType } from '@nestjs/swagger';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
