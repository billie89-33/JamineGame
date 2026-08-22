import { CreateArticleDto as SharedCreateArticleDto } from '@shared/dto';
import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreateArticleDto extends SharedCreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  excerpt!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  tags!: string[];
}
