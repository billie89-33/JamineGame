import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    const cloudinaryUrl = (process.env.CLOUDINARY_URL || '').replace(/['"]/g, '').trim();
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').replace(/['"]/g, '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || '').replace(/['"]/g, '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').replace(/['"]/g, '').trim();

    if (cloudinaryUrl) {
      cloudinary.config(cloudinaryUrl);
      this.logger.log('Cloudinary configured via CLOUDINARY_URL');
    } else if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.logger.log(`Cloudinary configured for cloud_name: ${cloudName}`);
    } else {
      this.logger.warn('Cloudinary credentials are missing or incomplete in environment variables');
      cloudinary.config({
        cloud_name: 'demo',
        api_key: 'demo',
        api_secret: 'demo',
        secure: true,
      });
    }
  }

  uploadMedia(file: Express.Multer.File): Promise<import('cloudinary').UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'gameverse_articles', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary stream error:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload failed: no result received'));
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
