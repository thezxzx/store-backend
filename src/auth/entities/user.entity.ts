import { Sale } from 'src/sales/entities/sale.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
  })
  email: string;

  @Column('varchar', {
    select: false,
  })
  password: string;

  @Column('varchar', {
    unique: true,
  })
  username: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('varchar', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @OneToMany(() => Sale, (sale) => sale.user)
  sale: Sale;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
