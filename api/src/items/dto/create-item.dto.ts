import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  organizationId: number;
}
