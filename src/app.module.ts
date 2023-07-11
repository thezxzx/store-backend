import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),

    // Base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: EnvConfiguration().host,
      port: EnvConfiguration().dbPort,
      username: EnvConfiguration().dbUsername,
      password: EnvConfiguration().dbPassword,
      database: EnvConfiguration().dbName,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ProductsModule,

    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
