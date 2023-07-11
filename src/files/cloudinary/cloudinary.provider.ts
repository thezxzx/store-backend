import { v2 as cloudinary } from 'cloudinary';
import { EnvConfiguration } from 'src/config/app.config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    console.log(process.env.CLOI);
    return cloudinary.config({
      cloud_name: EnvConfiguration().cloudinaryCloudName,
      api_key: EnvConfiguration().cloudinaryApiKey,
      api_secret: EnvConfiguration().cloudinaryApiSecret,
    });
  },
};
