import 'dotenv/config';

// Sanitize CLOUDINARY_URL before cloudinary package auto-initializes
if (process.env.CLOUDINARY_URL) {
  let url = process.env.CLOUDINARY_URL.replace(/['"]/g, '').trim();
  url = url.replace(/^CLOUDINARY_URL=/i, '').trim();
  if (url.startsWith('cloudinary://')) {
    process.env.CLOUDINARY_URL = url;
  } else {
    delete process.env.CLOUDINARY_URL;
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';

  // 0. Cookie Parser
  app.use(cookieParser());

  // 1. Security Headers
  app.use(helmet());

  // 2. Enable CORS
  app.enableCors({
    origin: isProduction
      ? [process.env.FRONTEND_URL as string, 'https://jamine-game-frontend.vercel.app'].filter(Boolean)
      : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://jamine-game-frontend.vercel.app'],
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

  // === ตั้งค่า Swagger ===
  const config = new DocumentBuilder()
    .setTitle('Gameverse API')
    .setDescription('คู่มือ API สำหรับโปรเจกต์ Gameverse')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ FATAL BOOTSTRAP ERROR:', err);
  process.exit(1);
});
