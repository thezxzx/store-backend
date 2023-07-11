import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  url: string;

  // Relación mucho a unos con productos
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
