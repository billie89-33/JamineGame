import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/articles.dto';
import { ArticleType } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    type?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search && search.trim()) {
      const searchTerm = search.trim();
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { excerpt: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (category && category.trim()) {
      where.category = { slug: category.trim() };
    }

    if (type && type.trim()) {
      where.articleType = type.trim().toUpperCase() as ArticleType;
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

  async findFeatured(limit: number = 5) {
    const featuredArticles = await this.prisma.article.findMany({
      where: { isFeatured: true },
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
    });

    if (featuredArticles.length < limit) {
      const needed = limit - featuredArticles.length;
      const excludeIds = featuredArticles.map((a) => a.id);
      const fallbackArticles = await this.prisma.article.findMany({
        where: excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {},
        take: needed,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
            select: { username: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });
      return {
        success: true,
        data: [...featuredArticles, ...fallbackArticles],
      };
    }

    return {
      success: true,
      data: featuredArticles,
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
