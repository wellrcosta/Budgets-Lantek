export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PAID_USER = 'paidUser',
  USER = 'user',
}

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  organizationId?: number
  createdAt: string
}

export interface Organization {
  id: number
  name: string
  description?: string
  createdAt: string
}

export enum BudgetStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Budget {
  id: number
  name: string
  description?: string
  totalAmount: number
  status: BudgetStatus
  userId: number
  organizationId?: number
  items?: Item[]
  itemsData?: BudgetItemData[]
  extraFees?: BudgetExtraFee[]
  createdAt: string
}

export interface Item {
  id: number
  name: string
  description?: string
  unitPrice: number
  organizationId: number
}

export interface BudgetItemData {
  itemId?: number
  name?: string
  unitPrice: number
  quantity: number
  discount: number
  isCustom?: boolean
}

export interface BudgetExtraFee {
  label: string
  amount: number
}
