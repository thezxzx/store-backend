import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  // @OneToMany(
  //   () => ProductImage, // Relacionar con la tabla ProductImage
  //   (productImage) => productImage.product, // Campo con el que se va a relacionar
  //   {
  //     cascade: true, // Operaciones en cascada | eliminación
  //     eager: true, // Cada vez que se use el método find va a cargar las relaciones
  //   },
  // )
  // @ApiProperty()
  // images?: ProductImage[];

  @BeforeInsert()
  lowerCaseName() {
    this.name = this.name.toLowerCase().trim();
  }
}
