import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/games.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.gamesService.findAll(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 10);
  }

  @Get('featured')
  findFeatured(
    @Query('limit') limit?: string,
    @Query('articlesLimit') articlesLimit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 3;
    const articlesLimitNum = articlesLimit ? parseInt(articlesLimit, 10) : 2;
    return this.gamesService.findFeatured(limitNum, articlesLimitNum);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.gamesService.findOne(slug);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
