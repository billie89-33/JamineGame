import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // ดึง token จาก cookie 'access_token'
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Please log in.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          process.env.JWT_SECRET || 'local_super_secret_gameverse_key_1150!',
      });
      // แปะข้อมูล payload ลงใน request.user เพื่อให้ Controller นำไปใช้ต่อ
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
    return true;
  }
}
