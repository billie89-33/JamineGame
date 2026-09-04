import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findForLogin(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { provider: 'LOCAL' },
        },
      },
    });
  }

  async create(data: RegisterDto, role: 'USER' | 'ADMIN' = 'USER') {
    // 1. Check if user already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername)
      throw new ConflictException('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Save to Database
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        role: role,
        accounts: {
          create: {
            provider: 'LOCAL',
            password: hashedPassword,
          },
        },
      },
      // Exclude accounts from the returned result if needed, but create doesn't include it by default
    });
  }
}
