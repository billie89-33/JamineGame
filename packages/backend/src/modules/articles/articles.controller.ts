import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/articles.dto';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: Request) {
    const userId = (req as any).user.sub;
    return this.articlesService.create(createArticleDto, userId);
  }
}
