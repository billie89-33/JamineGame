import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Security Headers
  app.use(helmet());

  // 2. Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 3. Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ลบฟิลด์ที่ไม่ได้อยู่ใน DTO ทิ้ง
      forbidNonWhitelisted: true, // แจ้ง Error ถ้ามีฟิลด์แปลกปลอม
      transform: true, // แปลง Type ให้อัตโนมัติ (เช่น String เป็น Number)
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
