import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '@shared/dto';
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

  async create(data: RegisterDto) {
    // 1. Check if user already exists
    const existingEmail = await this.findByEmail(data.email);
    if (existingEmail) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');

    const existingUsername = await this.findByUsername(data.username);
    if (existingUsername) throw new ConflictException('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Save to Database
    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        // role is defaulted to 'USER' in Prisma
      },
    });
  }
}
