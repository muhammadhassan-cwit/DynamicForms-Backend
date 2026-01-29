# DynamicForms Backend

A TypeForm-like backend system where companies can create dynamic forms, assign them to tenants, and collect submissions.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:
```
DATABASE_URL="postgresql://username:password@localhost:5432/dynamicforms"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-64-character-secret-key"
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Login user |
| POST | /api/v1/auth/logout | Logout user |

### Companies

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/companies | Create company |
| GET | /api/v1/companies | List all companies |
| GET | /api/v1/companies/:companyId | Get company by ID |
| PATCH | /api/v1/companies/:companyId | Update company |
| DELETE | /api/v1/companies/:companyId | Soft delete company |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/companies/:companyId/users | Create user |
| GET | /api/v1/companies/:companyId/users | List company users |
| GET | /api/v1/users/:userId | Get user by ID |
| DELETE | /api/v1/users/:userId | Soft delete user |

## Project Structure
```
src/
├── config/          # Configuration files
│   ├── db-client.ts    # Prisma client
│   ├── jwt.ts          # JWT token generation/verification
│   └── swagger.ts      # API docs config
├── controllers/     # Request handlers
│   ├── company-controller.ts
│   ├── user-controller.ts
│   └── auth-controller.ts
├── services/        # Business logic
│   ├── company-service.ts
│   ├── user-service.ts
│   └── auth-service.ts
├── routes/          # API routes
│   ├── company-routes.ts
│   ├── user-routes.ts
│   └── auth-routes.ts
├── middlewares/     # Custom middleware
├── errors/          # Error classes
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## Architecture
```
Request → Route → Middleware → Controller → Service → Prisma → Database
```

## Features Implemented

- [x] Company CRUD
- [x] User CRUD
- [x] Soft delete pattern
- [x] UUID-based public identifiers
- [x] Error handling system
- [ ] JWT Authentication
  - [x] JWT configuration (token generation & verification)
  - [x] Auth service (login/logout logic)
  - [x] Auth controller
  - [x] Auth routes
  - [ ] Auth middleware (route protection)
- [ ] Dynamic Forms
- [ ] Form Submissions

## Database Schema Notes

### User Model
- `email` - Unique across the system (one account per email)
- `role` - Required field, defaults to "employee"
- `token` - Stores active JWT for session management/revocation

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```