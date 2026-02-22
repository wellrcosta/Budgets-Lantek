import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll(@Request() req) {
    return this.budgetsService.findAll({
      id: req.user.sub,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.budgetsService.findById(id, {
      id: req.user.sub,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });
  }

  @Post()
  create(@Body() createDto: CreateBudgetDto, @Request() req) {
    return this.budgetsService.create(createDto, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateBudgetDto,
    @Request() req,
  ) {
    return this.budgetsService.update(id, updateDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.budgetsService.remove(id, req.user.sub);
  }
}
