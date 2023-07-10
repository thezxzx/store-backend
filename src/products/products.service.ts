import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { ...productDetails } = createProductDto;

      // Instancia del producto
      const product = this.productRepository.create({
        ...productDetails,
      });

      // Guardar en la base de datos
      await this.productRepository.save(product);

      return { ...product };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    return product;
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: {
          id: term,
          isActive: true,
        },
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('(prod.name = :name or prod.code = :code)', {
          name: term.toLowerCase(),
          code: term,
        })
        .andWhere('prod.isActive = true')
        // .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`);

    return product;
  }

  async findOnePlain(term: string) {
    const { ...product } = await this.findOne(term);
    return {
      ...product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // if (images) {
      //   await queryRunner.manager.delete(ProductImage, { product: { id } });

      //   product.images = images.map((image) =>
      //     this.productImageRepository.create({ url: image }),
      //   );
      // }

      // product.user = user; // Asignar el usuario actual al producto
      await queryRunner.manager.save(product);

      // Aplicar cambios
      await queryRunner.commitTransaction();

      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const product = await this.productRepository.preload({
      id,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      product.isActive = false;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      `Unexpected error, check server logs`,
    );
  }
}
