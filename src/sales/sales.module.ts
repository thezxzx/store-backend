import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DetailSale, Sale } from './entities';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService],
  imports: [TypeOrmModule.forFeature([Sale, DetailSale]), AuthModule],
})
export class SalesModule {}
