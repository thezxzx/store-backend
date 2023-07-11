import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Supplier } from 'src/suppliers/entities/supplier.entity';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @MinLength(3)
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @IsObject()
  supplier: Supplier;
}
