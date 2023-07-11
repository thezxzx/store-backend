import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryProvider],
  imports: [AuthModule],
  // exports: [CloudinaryProvider],
})
export class FilesModule {}
