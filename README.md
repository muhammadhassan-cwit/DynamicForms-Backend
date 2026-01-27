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
```

## API Endpoints

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
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
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
- [ ] JWT Authentication (in progress)
- [ ] Dynamic Forms
- [ ] Form Submissions

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```