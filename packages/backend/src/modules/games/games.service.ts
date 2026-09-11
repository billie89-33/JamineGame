import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto, GameResponseDto } from '@shared/dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto, authorId: string): Promise<GameResponseDto> {
    const game = await this.prisma.game.create({
      data: {
        ...createGameDto,
        authorId,
      },
      include: {
        category: true,
        author: true,
      }
    });

    return this.mapToDto(game);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true, author: true }
      }),
      this.prisma.game.count({ where: whereClause })
    ]);

    return {
      data: games.map(this.mapToDto),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string): Promise<GameResponseDto> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { category: true, author: true }
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return this.mapToDto(game);
  }

  async update(id: string, updateGameDto: UpdateGameDto): Promise<GameResponseDto> {
    const gameExists = await this.prisma.game.findUnique({ where: { id } });
    if (!gameExists) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    const game = await this.prisma.game.update({
      where: { id },
      data: updateGameDto,
      include: { category: true, author: true }
    });

    return this.mapToDto(game);
  }

  async remove(id: string): Promise<void> {
    const gameExists = await this.prisma.game.findUnique({ where: { id } });
    if (!gameExists) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    
    await this.prisma.game.delete({
      where: { id }
    });
  }

  private mapToDto(game: any): GameResponseDto {
    return {
      id: game.id,
      title: game.title,
      description: game.description,
      content: game.content,
      coverImage: game.coverImage,
      videoUrl: game.videoUrl,
      developer: game.developer,
      publisher: game.publisher,
      releaseDate: game.releaseDate,
      platforms: game.platforms,
      downloadLinks: game.downloadLinks,
      systemRequirements: game.systemRequirements,
      rating: game.rating,
      categoryId: game.categoryId,
      category: game.category ? { 
        id: game.category.id, 
        name: game.category.name,
        slug: game.category.slug
      } : undefined,
      tags: game.tags,
      authorId: game.authorId,
      author: game.author ? { 
        id: game.author.id, 
        username: game.author.username 
      } : undefined,
      isFeatured: game.isFeatured,
      publishedAt: game.publishedAt,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }
}
