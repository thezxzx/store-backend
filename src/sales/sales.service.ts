import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { DetailSale, Sale } from './entities';

@Injectable()
export class SalesService {
  private readonly logger = new Logger('SalesService');

  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(DetailSale)
    private readonly detailSaleRepository: Repository<DetailSale>,

    private readonly productsService: ProductsService,
  ) {}

  async create(createSaleDto: CreateSaleDto[], user: User) {
    let total: number = 0;

    try {
      let detailSale: DetailSale[] = [];

      for (const csd of createSaleDto) {
        const { product, quantity } = csd;
        total += product.price * quantity;

        // Actualizar el stock del producto
        await this.productsService.update(
          product.id,
          {
            stock: product.stock - quantity,
          },
          user,
        );

        // Guardar todos los productos en el detalle de ventas
        detailSale.push(
          this.detailSaleRepository.create({
            product,
            quantity,
          }),
        );
      }

      await this.detailSaleRepository.save(detailSale);

      const sale = this.saleRepository.create({
        detailSale,
        total,
        user,
      });

      await this.saleRepository.save(sale);

      return sale;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const sales = await this.saleRepository.find({
      select: {
        detailSale: {
          id: true,
          quantity: true,
        },
        total: true,
        createdAt: true,
      },
      relations: {
        detailSale: true,
      },
    });

    sales.map((sale) => {
      delete sale.user;
      // delete sale.total;
      sale;
      sale.detailSale.map(({ product, sale }) => {
        delete product.code;
        delete product.description;
        delete product.isActive;
        delete product.stock;
        delete product.images;
        delete product.location;
        delete sale.total;
        delete sale.createdAt;
      });
    });

    // const detailSales = await this.detailSaleRepository.find({
    //   select: {
    //     sale: {

    //     },
    //     product: {
    //       code: true,
    //     },
    //   },
    // });
    return sales;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      `Unexpected error, check server logs`,
    );
  }
}
