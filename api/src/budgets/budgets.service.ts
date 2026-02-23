import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(createDto: CreateBudgetDto, userId: number): Promise<Budget> {
    const totalAmount = this.calculateTotalAmount(createDto);
    const budget = this.budgetRepository.create({
      ...createDto,
      totalAmount,
      userId,
    });
    return this.budgetRepository.save(budget);
  }

  async findAll(user: { id: number; role: UserRole; organizationId?: number }): Promise<Budget[]> {
    if (user.role === UserRole.ADMIN) {
      return this.budgetRepository.find({
        relations: ['user', 'organization', 'items'],
      });
    }

    if (user.role === UserRole.MANAGER && user.organizationId) {
      return this.budgetRepository.find({
        where: { organizationId: user.organizationId },
        relations: ['user', 'organization', 'items'],
      });
    }

    return this.budgetRepository.find({
      where: { userId: user.id },
      relations: ['organization', 'items'],
    });
  }

  async findById(id: number, user: { id: number; role: UserRole; organizationId?: number }): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ['user', 'organization', 'items'],
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (user.role === UserRole.ADMIN || budget.userId === user.id) {
      return budget;
    }

    if (user.role === UserRole.MANAGER && budget.organizationId === user.organizationId) {
      return budget;
    }

    throw new ForbiddenException('You do not have access to this budget');
  }

  async update(id: number, updateDto: UpdateBudgetDto, userId: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.userId !== userId) {
      throw new ForbiddenException('You can only update your own budgets');
    }

    Object.assign(budget, updateDto);
    if (updateDto.itemsData || updateDto.extraFees) {
      budget.totalAmount = this.calculateTotalAmount({
        itemsData: updateDto.itemsData || budget.itemsData || [],
        extraFees: updateDto.extraFees || budget.extraFees || [],
      });
    }
    return this.budgetRepository.save(budget);
  }

  async remove(id: number, userId: number): Promise<void> {
    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.userId !== userId) {
      throw new ForbiddenException('You can only delete your own budgets');
    }

    await this.budgetRepository.delete(id);
  }

  private calculateTotalAmount(data: {
    itemsData?: {
      unitPrice: number;
      quantity: number;
      discount: number;
    }[];
    extraFees?: { amount: number }[];
  }): number {
    const itemsTotal = (data.itemsData || []).reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unitPrice || 0);
      const discount = Number(item.discount || 0);
      const lineTotal = quantity * unitPrice * (1 - discount / 100);
      return sum + (Number.isFinite(lineTotal) ? lineTotal : 0);
    }, 0);

    const feesTotal = (data.extraFees || []).reduce((sum, fee) => {
      const amount = Number(fee.amount || 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return Number((itemsTotal + feesTotal).toFixed(2));
  }
}
