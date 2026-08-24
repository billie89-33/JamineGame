import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // สร้างผู้ใช้ (ถ้าซ้ำมันจะ Error เด้งกลับไปเองจาก ConflictException ใน Service)
    const user = await this.usersService.create(registerDto);
    return { message: 'สมัครสมาชิกสำเร็จ', userId: user.id };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    const isProduction = process.env.NODE_ENV === 'production';

    // เซ็ต Cookie ด้วยเงื่อนไข Dev vs Prod
    res.cookie('access_token', result.access_token, {
      httpOnly: true, // ป้องกัน XSS
      secure: isProduction, // บน Prod ต้องเป็น HTTPS เท่านั้น
      sameSite: isProduction ? 'none' : 'lax', // อนุญาตให้ข้ามโดเมนบน Prod ได้
      maxAge: 1000 * 60 * 60 * 24, // 1 วัน
    });

    return { message: 'เข้าสู่ระบบสำเร็จ', user: result.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    // ลบ Cookie ทิ้ง
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return { message: 'ออกจากระบบสำเร็จ' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    const user = (req as any).user;
    return {
      message: 'ดึงข้อมูลโปรไฟล์สำเร็จ',
      user: {
        id: user.sub,
        username: user.username,
        role: user.role,
      },
    };
  }
}
