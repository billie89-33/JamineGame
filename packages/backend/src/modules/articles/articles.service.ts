import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.article.findMany({
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { username: true },
          },
        },
      }),
    ]);

    return {
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data,
    };
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

  private calculateReadTime(content: string): string {
    if (!content) return '1 min read';
    const textOnly = content.replace(/<[^>]*>?/gm, '');
    const wordCount = textOnly.split(/\s+/).filter((word) => word.length > 0).length;
    const readTimeMinutes = Math.ceil(wordCount / 200) || 1;
    return `${readTimeMinutes} min read`;
  }

  async create(data: CreateArticleDto, userId: string) {
    const readTime = this.calculateReadTime(data.content);
    return this.prisma.article.create({
      data: {
        ...data,
        readTime,
        authorId: userId,
      },
    });
  }

  async update(id: string, data: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    
    let readTime = article.readTime;
    if (data.content) {
      readTime = this.calculateReadTime(data.content);
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        ...(data.content ? { readTime } : {}),
      },
    });
  }

  async remove(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
