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

    // ==========================================
    // 🚧 TODO: เปลี่ยนเป็น false เมื่อต้องการเปิดใช้งานระบบ Login (ตรวจจับสิทธิ์) จริงๆ
    const DEV_BYPASS = false; 
    // ==========================================
    
    if (DEV_BYPASS) {
      // จำลองข้อมูลแอดมิน เพื่อให้สร้าง/แก้ไข ข้อมูลได้โดยไม่ติด Error Foreign Key
      request['user'] = { sub: '276027ba-3f97-42b8-b19d-ebc87196ccea', username: 'DevAdmin', role: 'ADMIN' };
      return true;
    }

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
