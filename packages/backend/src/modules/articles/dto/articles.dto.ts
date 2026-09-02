import { CreateArticleDto as SharedCreateArticleDto } from '@shared/dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
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
  declare categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  declare tags: string[];

  @IsString()
  @IsOptional()
  declare gameId?: string;
}

import { PartialType } from '@nestjs/swagger';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
