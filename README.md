# Budgets-Lantek

Sistema completo de gestão de orçamentos com controle por organização e permissões baseadas em papéis.

## 🚀 Tecnologias

**Backend:** NestJS + TypeScript + TypeORM + SQLite + JWT Auth
**Frontend:** Vue.js 3 + TypeScript + Pinia + Vue Router

## 📁 Estrutura do Projeto

```
Budgets-Lantek/
├── api/                    # Backend NestJS
│   ├── src/
│   │   ├── auth/          # Autenticação JWT
│   │   ├── users/         # Gerenciamento de usuários
│   │   ├── organizations/ # Organizações
│   │   ├── budgets/       # Orçamentos + Export CSV
│   │   ├── items/         # Itens reutilizáveis
│   │   └── common/        # Guards, decorators, enums
│   └── package.json
├── web/                    # Frontend Vue.js
│   ├── src/
│   │   ├── views/         # Páginas
│   │   ├── components/    # Componentes
│   │   ├── store/         # Pinia stores
│   │   └── services/      # API services
│   └── package.json
└── README.md
```

## ✅ Funcionalidades

### Autenticação
- [x] Registro de usuários
- [x] Login com JWT
- [x] Proteção de rotas

### Papéis e Permissões
| Papel | Permissões |
|-------|------------|
| **admin** | Acesso total, todas as organizações |
| **manager** | Ver orçamentos da sua organização, gerenciar usuários |
| **paidUser** | Criar orçamentos, itens ilimitados |
| **user** | Criar orçamentos, itens limitados |

### Orçamentos
- [x] Criar orçamentos
- [x] Adicionar itens aos orçamentos
- [x] Calcular totais
- [x] Exportar para CSV

### Itens
- [x] Criar itens reutilizáveis por organização
- [x] Definir preço unitário
- [x] Vincular a múltiplos orçamentos

### Organizações
- [x] Criar organizações (admin/manager)
- [x] Vincular usuários à organização
- [x] Isolamento de dados por organização

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clonar o repositório

```bash
git clone https://github.com/wellrcosta/Budgets-Lantek.git
cd Budgets-Lantek
```

### 2. Instalar e rodar o Backend

```bash
cd api
npm install
npm run start
```

O backend estará rodando em `http://localhost:3000`

### 3. Instalar e rodar o Frontend

```bash
cd web
npm install
npm run dev
```

O frontend estará em `http://localhost:5173`

## 📖 Endpoints da API

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login

### Usuários
- `GET /users` - Listar usuários (admin/manager)
- `GET /users/:id` - Ver usuário
- `POST /users` - Criar usuário (admin)
- `PATCH /users/:id` - Atualizar usuário

### Organizações
- `GET /organizations` - Listar (admin)
- `POST /organizations` - Criar (admin/manager)
- `PATCH /organizations/:id` - Atualizar

### Orçamentos
- `GET /budgets` - Listar (RBAC: admin=all, manager=org, user=own)
- `POST /budgets` - Criar orçamento
- `PATCH /budgets/:id` - Atualizar
- `DELETE /budgets/:id` - Deletar

### Itens
- `GET /items` - Listar itens
- `POST /items` - Criar item (admin/manager/paidUser)

### Exportação
- `GET /budgets/export/csv` - Exportar todos os orçamentos
- `GET /budgets/export/csv/:id` - Exportar orçamento específico

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `api/`:

```env
JWT_SECRET=sua-chave-secreta-aqui
PORT=3000
```

## 📊 Testando a API

### Registro
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123","name":"Nome Usuario"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'
```

### Acessar protegido (use o token do login)
```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:3000/budgets
```

## 🏗️ Arquitetura

### Database Schema

**Users:** id, email, password, name, role, organizationId, createdAt, updatedAt

**Organizations:** id, name, description, createdAt, updatedAt

**Budgets:** id, name, description, totalAmount, status, userId, organizationId, createdAt, updatedAt

**Items:** id, name, description, unitPrice, organizationId, createdAt, updatedAt

**BudgetItems:** budgetId, itemId, quantity, discount

## 📝 Scripts Disponíveis

### Backend
- `npm run start` - Iniciar em modo produção
- `npm run start:dev` - Iniciar em modo desenvolvimento com hot-reload
- `npm run build` - Compilar TypeScript
- `npm run test` - Rodar testes

### Frontend
- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## 🐛 Troubleshooting

### Erro: "Cannot find module '@nestjs/cli'"
```bash
cd api && npm install --save-dev @nestjs/cli
```

### Erro: "Cannot find module 'ts-node'"
```bash
cd api && npm install --save-dev ts-node
```

### Porta 3000 em uso
```bash
# Matar processos na porta 3000
lsof -ti:3000 | xargs kill -9
```

## 📄 Licença

MIT

## 👤 Autor

Criado por Claw para wellrcosta
