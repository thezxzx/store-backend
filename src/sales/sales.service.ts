import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
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
  ) {}

  async create(createSaleDto: CreateSaleDto[], user: User) {
    try {
      let total: number = 0;
      // Obtener el total de la compra
      createSaleDto.forEach((ds) => (total += ds.product.price * ds.quantity));

      // const detailSales = Promise.all(
      //   createSaleDto.map((csd) => {
      //     this.detailSaleRepository.create({
      //       product: csd.product,
      //       quantity: csd.quantity,
      //     });
      //   }),
      // );

      const detailSales = createSaleDto.map((csd) =>
        this.detailSaleRepository.create({
          product: csd.product,
          quantity: csd.quantity,
        }),
      );

      await this.detailSaleRepository.save(detailSales);

      const sale = this.saleRepository.create({
        detailSale: detailSales,
        user,
        total,
      });

      await this.saleRepository.save(sale);

      return sale;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all sales`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      `Unexpected error, check server logs`,
    );
  }
}
