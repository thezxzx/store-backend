import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DetailSale } from './detail-sale.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sale, { eager: true })
  user: User;

  @OneToMany(() => DetailSale, (detailSale) => detailSale.sale)
  detailSale: DetailSale[];

  @Column('float')
  total: number;

  @CreateDateColumn()
  createdAt: Date;
}
