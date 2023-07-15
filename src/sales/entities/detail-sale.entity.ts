import { Product } from 'src/products/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('detail_sale')
export class DetailSale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.detailSale, { eager: true })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.detailSale)
  product: Product;

  @Column('int')
  quantity: number;
}
