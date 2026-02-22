# Budgets-Lantek - Project Documentation

## Project Overview
Full-stack application for budget management with organization support.
Tech Stack: NestJS (API) + Vue.js 3 (Frontend) + SQLite

## Structure
```
Budgets-Lantek/
├── api/                    # NestJS Backend (COMPLETE)
│   src/
│   ├── auth/              # ✅ JWT Authentication
│   ├── users/             # ✅ User management
│   ├── organizations/     # ✅ Organization CRUD
│   ├── budgets/           # ✅ Budgets + Export CSV
│   ├── items/             # ✅ Reusable items
│   └── common/            # ✅ Guards, decorators, enums
└── web/                   # ⏳ Vue.js Frontend (TODO)
```

## API Features ✅

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - Login, returns JWT

### Users (RBAC)
- GET /users - List all (admin/manager)
- GET /users/:id - Get user
- GET /users/organization/:id - List by org (manager/admin)
- POST /users - Create (admin)
- PATCH /users/:id - Update
- DELETE /users/:id - Delete (admin)

### Organizations
- GET /organizations - List all (admin)
- GET /organizations/:id - Get org
- POST /organizations - Create (admin/manager)
- PATCH /organizations/:id - Update (admin/manager)
- DELETE /organizations/:id - Delete (admin)

### Budgets
- GET /budgets - List budgets (RBAC: admin=all, manager=org, user=own)
- GET /budgets/:id - Get budget
- POST /budgets - Create budget
- PATCH /budgets/:id - Update own budget
- DELETE /budgets/:id - Delete own budget

### Items
- GET /items?organizationId=X - List items
- GET /items/:id - Get item
- POST /items - Create (admin/manager/paidUser)
- PATCH /items/:id - Update
- DELETE /items/:id - Delete (admin/manager)

### Export
- GET /budgets/export/csv/:id - Export single budget to CSV
- GET /budgets/export/csv - Export all budgets to CSV

## Roles & Permissions
| Role | Permissions |
|------|-------------|
| admin | Full access, all organizations |
| manager | View org budgets, create items, manage users |
| paidUser | Create budgets, unlimited items |
| user | Create budgets, limited items |

## Database Schema
📄 See entities in api/src/**/entities/

## Last Updated
2026-02-22 - API complete, Frontend TODO

## Next Steps
1. ⏳ Create Vue.js frontend
2. ⏳ Vuex store setup
3. ⏳ Login page
4. ⏳ Dashboard with role-based views
