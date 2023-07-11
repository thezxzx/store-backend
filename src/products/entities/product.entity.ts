import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
  })
  name: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('varchar', {
    unique: true,
  })
  code: string;

  @Column('text', {
    nullable: true,
  })
  description?: string;

  @Column('varchar', {
    nullable: true,
  })
  location?: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  // Relación uno a muchos con product_images
  @OneToMany(
    () => ProductImage, // Relacionar con la tabla ProductImage
    (productImage) => productImage.product, // Campo con el que se va a relacionar
    {
      cascade: true, // Operaciones en cascada | eliminación
      eager: true, // Cada vez que se use el método find va a cargar las relaciones
    },
  )
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  lowerCaseName() {
    this.name = this.name.toLowerCase().trim();
  }
}
