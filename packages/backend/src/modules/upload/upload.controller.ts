import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @Post('media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('ไม่พบไฟล์รูปภาพที่ต้องการอัปโหลด');
    }

    try {
      const result = await this.uploadService.uploadMedia(file);
      return {
        message: 'Upload successful',
        url: result.secure_url,
      };
    } catch (error: any) {
      this.logger.error('Media upload error:', error);
      const errorMessage = error?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ';
      throw new BadRequestException(`Media upload failed: ${errorMessage}`);
    }
  }
}
