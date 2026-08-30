import { IsString, IsOptional, IsArray, IsDateString, IsNumber } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  developer?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsDateString()
  @IsOptional()
  releaseDate?: string;

  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsNumber()
  @IsOptional()
  rating?: number;
}

import { PartialType } from '@nestjs/swagger';

export class UpdateGameDto extends PartialType(CreateGameDto) {}
