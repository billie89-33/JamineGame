import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto } from './dto/games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      this.prisma.game.count(),
      this.prisma.game.findMany({ skip, take: limit }),
    ]);
    return { success: true, total, page, totalPages: Math.ceil(total / limit), data };
  }

  async findFeatured(limit: number = 3, articlesLimit: number = 2) {
    const data = await this.prisma.game.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        articles: {
          take: articlesLimit,
          orderBy: { publishedAt: 'desc' },
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
    return { success: true, data };
  }

  async findOne(slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: { articles: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async create(data: CreateGameDto) {
    return this.prisma.game.create({ data });
  }

  async update(id: string, data: UpdateGameDto) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.update({ where: { id }, data });
  }

  async remove(id: string) {
    const game = await this.prisma.game.findUnique({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return this.prisma.game.delete({ where: { id } });
  }
}
