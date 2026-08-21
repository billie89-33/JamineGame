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
      ? (process.env.FRONTEND_URL as string) // บน Production ให้รับเฉพาะ Vercel
      : ['http://localhost:3000', 'http://127.0.0.1:3000'], // บน Dev ให้รับ Localhost
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
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
