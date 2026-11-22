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

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

function getAuthCookieOptions(includeMaxAge = true) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // ป้องกัน XSS
    secure: isProduction, // บน Prod ต้องเป็น HTTPS เท่านั้น
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax', // อนุญาตให้ข้ามโดเมนบน Prod ได้
    ...(includeMaxAge ? { maxAge: THIRTY_DAYS_MS } : {}),
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    // สร้างผู้ใช้ (ถ้าซ้ำมันจะ Error เด้งกลับไปเองจาก ConflictException ใน Service)
    const user = await this.usersService.create(registerDto, 'USER');
    return { message: 'สมัครสมาชิกสำเร็จ', userId: user.id };
  }

  // 🚧 สำหรับสมัคร Admin โดยเฉพาะ (อาจจะต้องเพิ่ม Secret Key ป้องกันในอนาคต)
  @Post('register-admin')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto, 'ADMIN');
    return { message: 'สมัครสมาชิก Admin สำเร็จ', userId: user.id };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('access_token', result.access_token, getAuthCookieOptions(true));

    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      user: result.user,
      access_token: result.access_token,
    };
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = (req as Request & { user: { sub: string; username: string; role: string } }).user;
    const result = await this.authService.refreshSession(user);

    res.cookie('access_token', result.access_token, getAuthCookieOptions(true));

    return {
      message: 'ต่ออายุเซสชันสำเร็จ',
      user: result.user,
      access_token: result.access_token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', getAuthCookieOptions(false));

    return { message: 'ออกจากระบบสำเร็จ' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    const user = (req as Request & { user: { sub: string; username: string; role: string } }).user;
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
