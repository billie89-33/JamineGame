import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  declare name: string;

  @IsString()
  @IsNotEmpty()
  declare slug: string;

  @IsString()
  @IsOptional()
  declare icon?: string;

  @IsString()
  @IsOptional()
  declare description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
