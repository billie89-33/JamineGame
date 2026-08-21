import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // ทำให้ JWT ใช้ได้กับทุก Guard โดยไม่ต้อง Import ซ้ำ
      secret: process.env.JWT_SECRET || 'local_super_secret_gameverse_key_1150!',
      signOptions: { expiresIn: '1d' }, // หมดอายุใน 1 วัน
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
