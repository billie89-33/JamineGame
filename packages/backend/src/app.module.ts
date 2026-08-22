import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ArticlesModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
