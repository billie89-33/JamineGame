import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(data: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new ConflictException('Category slug already exists');
    
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.findOne(id); // ensure exists
    
    if (data.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Category slug already exists');
      }
    }
    
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
