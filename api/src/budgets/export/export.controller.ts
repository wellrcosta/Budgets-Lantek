import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExportService } from './export.service';

@Controller('budgets/export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('csv/:id')
  async exportBudget(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportBudgetToCsv(id, {
      sub: req.user.sub,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="budget-${id}.csv"`);
    res.send(csv);
  }

  @Get('csv')
  async exportAllBudgets(@Request() req, @Res() res: Response) {
    const csv = await this.exportService.exportBudgetsToCsv({
      sub: req.user.sub,
      role: req.user.role,
      organizationId: req.user.organizationId,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="budgets.csv"');
    res.send(csv);
  }
}
