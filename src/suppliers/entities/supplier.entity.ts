import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('supliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
  })
  companyName: string;

  @Column('varchar', {
    unique: true,
  })
  supplierName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.supplier)
  product: Product;

  @BeforeInsert()
  checkCompanyName() {
    this.companyName = this.companyName.toLowerCase().trim();
  }
}
