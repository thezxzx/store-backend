import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, Min } from 'class-validator';
import { Product } from 'src/products/entities';

export class CreateSaleDto {
  @IsObject({
    each: true,
  })
  @IsArray()
  product: Product;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
