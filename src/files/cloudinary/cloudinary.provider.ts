import { v2 as cloudinary } from 'cloudinary';
import { EnvConfiguration } from 'src/config/app.config';

export const CloudinaryProvider = {
  provide: EnvConfiguration().cloudinary,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: EnvConfiguration().cloudinaryCloudName,
      api_key: EnvConfiguration().cloudinaryApiKey,
      api_secret: EnvConfiguration().cloudinaryApiSecret,
    });
  },
};
