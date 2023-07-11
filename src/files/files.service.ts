import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryReponse } from './types/cloudinary-response';

@Injectable()
export class FilesService {
  async uploadImage(image: Express.Multer.File): Promise<CloudinaryReponse> {
    return new Promise<CloudinaryReponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            use_filename: true,
            folder: 'products',
            filename_override: image.originalname,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(image.buffer);
    });
  }
}
