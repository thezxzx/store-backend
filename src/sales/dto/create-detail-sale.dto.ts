import { Type } from 'class-transformer';
import { IsNumber, IsObject, Min } from 'class-validator';
import { Product } from 'src/products/entities';

export class CreateDetailSaleDto {
  @IsObject()
  product: Product;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
