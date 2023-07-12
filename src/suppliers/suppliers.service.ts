import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger('SuppliersService');

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = this.supplierRepository.create(createSupplierDto);

      await this.supplierRepository.save(supplier);

      return supplier;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const suppliers = await this.supplierRepository.find({
      take: limit,
      skip: offset,
      where: {
        isActive: true,
      },
    });

    return suppliers;
  }

  findOne(id: string) {
    const supplier = this.supplierRepository.findOne({
      where: { id, isActive: true },
    });

    return supplier;
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplierUpdate = updateSupplierDto;

    const supplier = await this.supplierRepository.preload({
      id,
      ...supplierUpdate,
    });

    if (!supplier)
      throw new NotFoundException(`Supplier with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(supplier);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return supplier;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const supplier = await this.supplierRepository.preload({
      id,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      supplier.isActive = false;
      await queryRunner.manager.save(supplier);

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
