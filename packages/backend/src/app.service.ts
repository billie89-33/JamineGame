import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStats() {
    const [totalArticles, totalUsers] = await Promise.all([
      this.prisma.article.count(),
      this.prisma.user.count(),
    ]);

    return {
      totalArticles,
      totalUsers,
    };
  }
}
