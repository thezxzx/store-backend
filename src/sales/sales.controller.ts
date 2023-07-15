import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createSaleDto: CreateSaleDto[], @GetUser() user: User) {
    return this.salesService.create(createSaleDto, user);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }
}
