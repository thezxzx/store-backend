import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { FilesService } from './files.service';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg|jpg|png' })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    const urls = await Promise.all(
      files.map(async (file): Promise<string> => {
        // const { secure_url } =
        return (await this.filesService.uploadImage(file)).secure_url;
        // return secure_url;
      }),
    );
    return urls;
  }
}
