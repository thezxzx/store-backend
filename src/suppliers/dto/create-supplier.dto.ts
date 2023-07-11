import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @MinLength(3)
  companyName: string;

  @IsString()
  @MinLength(3)
  supplierName: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
