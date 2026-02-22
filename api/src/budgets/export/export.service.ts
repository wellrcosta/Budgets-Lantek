import { Injectable } from '@nestjs/common';
import { BudgetsService } from '../budgets.service';
import { Budget } from '../entities/budget.entity';

@Injectable()
export class ExportService {
  constructor(private readonly budgetsService: BudgetsService) {}

  async exportBudgetToCsv(budgetId: number, user: any): Promise<string> {
    const budget = await this.budgetsService.findById(budgetId, user);
    
    const headers = ['ID', 'Name', 'Description', 'Status', 'Total Amount', 'Created At'];
    const budgetRow = [
      budget.id,
      budget.name,
      budget.description || '',
      budget.status,
      budget.totalAmount,
      budget.createdAt.toISOString(),
    ];

    let csv = headers.join(',') + '\n';
    csv += this.escapeCsvRow(budgetRow) + '\n\n';

    if (budget.items && budget.items.length > 0) {
      csv += 'Items:\n';
      csv += 'Item ID,Name,Description,Unit Price,Quantity,Discount,Total\n';
      
      for (const item of budget.items) {
        const itemData = budget.itemsData?.find(d => d.itemId === item.id);
        const quantity = itemData?.quantity || 1;
        const discount = itemData?.discount || 0;
        const total = item.unitPrice * quantity * (1 - discount / 100);
        
        const row = [
          item.id,
          item.name,
          item.description || '',
          item.unitPrice,
          quantity,
          discount,
          total.toFixed(2),
        ];
        csv += this.escapeCsvRow(row) + '\n';
      }
    }

    return csv;
  }

  async exportBudgetsToCsv(user: any): Promise<string> {
    const budgets = await this.budgetsService.findAll(user);
    
    const headers = ['ID', 'Name', 'Description', 'Status', 'Total Amount', 'Organization', 'User', 'Created At'];
    let csv = headers.join(',') + '\n';
    
    for (const budget of budgets) {
      const row = [
        budget.id,
        budget.name,
        budget.description || '',
        budget.status,
        budget.totalAmount,
        budget.organization?.name || '',
        budget.user?.name || '',
        budget.createdAt.toISOString(),
      ];
      csv += this.escapeCsvRow(row) + '\n';
    }

    return csv;
  }

  private escapeCsvRow(values: any[]): string {
    return values.map(value => {
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '"")}"`;
      }
      return str;
    }).join(',');
  }
}
