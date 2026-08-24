import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.article.findMany({
      orderBy: { publishedAt: 'desc' },
      include: {
        author: {
          select: { username: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { username: true },
        },
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async create(data: CreateArticleDto, userId: string) {
    return this.prisma.article.create({
      data: {
        ...data,
        authorId: userId,
      },
    });
  }
}
