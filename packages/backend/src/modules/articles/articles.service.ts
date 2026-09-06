import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<
        | { title: { contains: string; mode: 'insensitive' } }
        | { excerpt: { contains: string; mode: 'insensitive' } }
      >;
    } = {};

    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { username: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    return {
      success: true,
      total,
      page,
      totalPages: total > 0 ? Math.ceil(total / limit) : 1,
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
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  private calculateReadTime(content: string): number {
    if (!content) return 1;
    const textOnly = content.replace(/<[^>]*>?/gm, '');
    const wordCount = textOnly.split(/\s+/).filter((word) => word.length > 0).length;
    const readTimeMinutes = Math.ceil(wordCount / 200) || 1;
    return readTimeMinutes;
  }

  async create(data: CreateArticleDto, userId: string) {
    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category not found with ID: ${data.categoryId}`);
      }
    }

    const readTime = this.calculateReadTime(data.content);
    return this.prisma.article.create({
      data: {
        ...data,
        categoryId: data.categoryId || null,
        coverImage: data.coverImage || null,
        videoUrl: data.videoUrl || null,
        gameId: data.gameId || null,
        readTime,
        authorId: userId,
      },
    });
  }

  async update(
    id: string,
    data: UpdateArticleDto,
    currentUser?: { sub: string; role: string },
  ) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      currentUser &&
      currentUser.role !== 'ADMIN' &&
      article.authorId !== currentUser.sub
    ) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขบทความนี้');
    }

    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new BadRequestException(`Category not found with ID: ${data.categoryId}`);
      }
    }
    
    let readTime = article.readTime;
    if (data.content) {
      readTime = this.calculateReadTime(data.content);
    }

    return this.prisma.article.update({
      where: { id },
      data: {
        ...data,
        ...(data.categoryId !== undefined ? { categoryId: data.categoryId || null } : {}),
        ...(data.coverImage !== undefined ? { coverImage: data.coverImage || null } : {}),
        ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl || null } : {}),
        ...(data.gameId !== undefined ? { gameId: data.gameId || null } : {}),
        ...(data.content ? { readTime } : {}),
      },
    });
  }

  async remove(id: string, currentUser?: { sub: string; role: string }) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (
      currentUser &&
      currentUser.role !== 'ADMIN' &&
      article.authorId !== currentUser.sub
    ) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์ลบบทความนี้');
    }
    
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
