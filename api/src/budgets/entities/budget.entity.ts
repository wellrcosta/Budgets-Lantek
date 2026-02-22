import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BudgetStatus } from '../../common/enums/budget-status.enum';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'simple-enum', enum: BudgetStatus, default: BudgetStatus.DRAFT })
  status: BudgetStatus;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  organizationId: number | null;

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization | null;

  @ManyToMany(() => Item)
  @JoinTable({
    name: 'budget_items',
    joinColumn: { name: 'budgetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'itemId', referencedColumnName: 'id' },
  })
  items: Item[];

  @Column({ type: 'simple-json', nullable: true })
  itemsData: { itemId: number; quantity: number; discount: number; unitPrice: number }[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
