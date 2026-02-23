import { IsString, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { BudgetStatus } from '../../common/enums/budget-status.enum';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;

  @IsOptional()
  @IsArray()
  itemsData?: {
    itemId?: number;
    name?: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    isCustom?: boolean;
  }[];

  @IsOptional()
  @IsArray()
  extraFees?: { label: string; amount: number }[];
}
