import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    let cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').replace(/['"]/g, '').trim();
    let apiKey = (process.env.CLOUDINARY_API_KEY || '').replace(/['"]/g, '').trim();
    let apiSecret = (process.env.CLOUDINARY_API_SECRET || '').replace(/['"]/g, '').trim();
    const cloudinaryUrl = (process.env.CLOUDINARY_URL || '').replace(/['"]/g, '').trim();

    if (cloudinaryUrl) {
      try {
        const cleanedUrl = cloudinaryUrl.replace(/^CLOUDINARY_URL=/i, '').trim();
        if (cleanedUrl.startsWith('cloudinary://')) {
          const parsed = new URL(cleanedUrl);
          apiKey = parsed.username || apiKey;
          apiSecret = parsed.password || apiSecret;
          cloudName = parsed.hostname || cloudName;
        }
      } catch (e) {
        this.logger.warn('Could not parse CLOUDINARY_URL, checking standard variables');
      }
    }

    if (cloudName && apiKey && apiSecret && cloudName !== 'demo') {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.logger.log(`Cloudinary configured for cloud_name: ${cloudName}`);
    } else {
      this.logger.warn('Cloudinary credentials missing or incomplete in environment');
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
