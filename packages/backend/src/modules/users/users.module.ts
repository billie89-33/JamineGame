import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // ส่งออกให้ AuthModule เอาไปใช้
})
export class UsersModule {}
