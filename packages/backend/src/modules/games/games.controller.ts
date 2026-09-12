import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDtoClass, UpdateGameDtoClass } from './dto/games.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createGameDto: CreateGameDtoClass, @Request() req) {
    return this.gamesService.create(createGameDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string
  ) {
    return this.gamesService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDtoClass) {
    return this.gamesService.update(id, updateGameDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
