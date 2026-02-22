# Budgets-Lantek - Project Documentation

## Project Overview
Full-stack application for budget management with organization support.

## Tech Stack
- **Backend**: NestJS (TypeScript) + SQLite + TypeORM
- **Frontend**: Vue.js 3 + TypeScript + Vuex + Vue Router

## Project Structure
```
Budgets-Lantek/
├── api/                    # NestJS Backend
│   src/
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── organizations/     # Organization CRUD
│   ├── budgets/           # Budget management
│   ├── items/             # Reusable items
│   └── common/            # Shared resources
└── web/                   # Vue.js Frontend
    src/
    ├── views/             # Page components
    ├── components/        # Shared components
    ├── store/             # Vuex store
    ├── router/            # Vue Router config
    └── services/          # API services

## Features Status

### ✅ Completed
- [x] Project structure created
- [x] Database schema designed (SQLite)
- [x] Role-based access control (RBAC) defined

### 🚧 In Progress
- [ ] API NestJS setup
- [ ] Authentication system (JWT)
- [ ] User management

### 📋 Pending
- [ ] Organization CRUD
- [ ] Budget creation
- [ ] Items management
- [ ] Export to XLS/CSV
- [ ] Organization membership
- [ ] Admin panel
- [ ] Manager dashboard
- [ ] Vue.js frontend

## Database Schema

### Users
- id: number (PK)
- email: string (unique)
- password: string (hashed)
- name: string
- role: enum (admin, manager, paidUser, user)
- organizationId: number (FK, nullable)
- createdAt: date
- updatedAt: date

### Organizations
- id: number (PK)
- name: string
- description: string
- createdAt: date
- updatedAt: date

### Budgets
- id: number (PK)
- name: string
- description: string
- totalAmount: number
- status: enum (draft, pending, approved, rejected)
- userId: number (FK)
- organizationId: number (FK)
- createdAt: date
- updatedAt: date

### Items
- id: number (PK)
- name: string
- description: string
- unitPrice: number
- organizationId: number (FK)
- createdAt: date
- updatedAt: date

### BudgetItems (junction table)
- budgetId: number (FK)
- itemId: number (FK)
- quantity: number
- discount: number

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| admin | Full access, all organizations |
| manager | View org budgets, users in org |
| paidUser | Create budgets, unlimited items |
| user | Create budgets, limited items |

## Last Updated
2026-02-22
