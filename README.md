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

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/v1/auth/login | Login user | No | - |
| POST | /api/v1/auth/logout | Logout user | Yes | Any |

### Companies

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/v1/companies | Create company | Yes | Admin |
| GET | /api/v1/companies | List all companies | Yes | Any |
| GET | /api/v1/companies/:id | Get company by ID | Yes | Any |
| PATCH | /api/v1/companies/:id | Update company | Yes | Admin |
| DELETE | /api/v1/companies/:id | Soft delete company | Yes | Admin |

### Users

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/v1/companies/:companyId/users | Create user | Yes | Admin |
| GET | /api/v1/companies/:companyId/users | List company users | Yes | Any |
| GET | /api/v1/users/:userId | Get user by ID | Yes | Any |
| PATCH | /api/v1/users/:userId/deactivate | Deactivate user | Yes | Admin |
| DELETE | /api/v1/users/:userId | Soft delete user | Yes | Admin |

### Forms

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/v1/forms | Create form | Yes | Admin |
| GET | /api/v1/forms | List company forms | Yes | Any |
| GET | /api/v1/forms/:formId | Get form by ID | Yes | Any |
| GET | /api/v1/forms/:formId/versions | Get form version history | Yes | Any |
| PATCH | /api/v1/forms/:formId | Update form (creates new version) | Yes | Admin |
| DELETE | /api/v1/forms/:formId | Soft delete form | Yes | Admin |

### Public (No Auth Required)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/public/forms/:formId | Get public form to fill | No | - |
| POST | /api/v1/public/forms/:formId/submit | Submit form response | No | - |
| POST | /api/v1/public/forms/:formId/validate-upload | Validate file before upload | No | - |
| POST | /api/v1/public/forms/:formId/upload | Upload file for form field | No | - |
| GET | /api/v1/public/submissions/:id?email=x | View own submission | No | - |

### Submissions (Admin)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/forms/:formId/submissions | List all submissions | Yes | Any |
| GET | /api/v1/submissions/:submissionId | Get submission details | Yes | Any |
| DELETE | /api/v1/submissions/:submissionId | Delete submission | Yes | Admin |

## Project Structure
```
src/
├── config/
│   ├── db-client.ts
│   ├── jwt.ts
│   ├── multer.ts
│   └── swagger.ts
├── controllers/
│   ├── company-controller.ts
│   ├── user-controller.ts
│   ├── auth-controller.ts
│   ├── form-controller.ts
│   ├── public-form-controller.ts
│   ├── upload-controller.ts
│   └── submission-controller.ts
├── services/
│   ├── company-service.ts
│   ├── user-service.ts
│   ├── auth-service.ts
│   ├── form-service.ts
│   ├── public-form-service.ts
│   ├── upload-service.ts
│   └── submission-service.ts
├── routes/
│   ├── company-routes.ts
│   ├── user-routes.ts
│   ├── auth-routes.ts
│   ├── form-routes.ts
│   ├── public-routes.ts
│   └── submission-routes.ts
├── middlewares/
│   ├── validate-uuid-param.ts
│   └── auth-middleware.ts
├── errors/
│   ├── http-error.ts
│   ├── bad-request-error.ts
│   └── not-found-error.ts
├── app.ts
└── server.ts
```

## Architecture
```
Request → Route → Middleware → Controller → Service → Prisma → Database
```

## Authentication & Authorization

### How It Works

1. User logs in with email/password
2. Server returns JWT token
3. Client includes token in subsequent requests
4. Middleware validates token before allowing access
5. Role-based middleware checks permissions

### Using Protected Routes

Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles

- **Admin**: Full access (create, read, update, delete)
- **Employee**: Limited access (read only)

## Form Versioning

Forms support versioning to maintain history when forms are modified:

- **parentGroupId**: Links all versions of the same form together
- **versionMajor/versionMinor**: Semantic versioning (e.g., 1.0, 1.1, 2.0)
- **isCurrent**: Indicates the active version

### How It Works

1. Admin creates form → Version 1.0
2. Admin updates form → Old version marked as `isCurrent: false`, new version 1.1 created
3. Major changes → Version increments to 2.0
4. Old versions preserved for submission history

### Example Form Structure
```json
{
  "title": "Customer Feedback",
  "description": "Get feedback from customers",
  "structureSchema": [
    {
      "id": "name",
      "type": "text",
      "label": "Your Name",
      "required": true
    },
    {
      "id": "rating",
      "type": "select",
      "label": "Rating",
      "options": ["Excellent", "Good", "Average", "Poor"],
      "required": true
    }
  ]
}
```

## File Upload System

The system supports file and image uploads with per-field validation.

### How It Works

1. Frontend calls validate endpoint with file metadata (size, type)
2. Backend checks against field's configured limits
3. If valid, frontend uploads the actual file
4. File is stored in `uploads/{formId}/` folder
5. File path is returned and stored in submission responseData

### Upload Flow
```
User picks file → Validate metadata → Upload file → Get file path → Submit form with path
```

### Supported File Types

**Images:** JPEG, PNG, GIF, WEBP (default max: 5MB)

**Documents:** PDF, DOC, DOCX, XLS, XLSX, CSV, TXT (default max: 10MB)

### Admin Configuration

Admins can customize per field:
- `maxSize`: Maximum file size in bytes
- `allowedTypes`: Array of allowed MIME types

### Example File Field
```json
{
  "id": "resume",
  "type": "file",
  "label": "Upload Resume",
  "required": true,
  "maxSize": 5242880,
  "allowedTypes": ["application/pdf"]
}
```

## Public Forms

Forms can be accessed publicly (without authentication) when:
- `isPublished: true` - Form is published
- `isCurrent: true` - Form is the active version
- `isDeleted: false` - Form is not deleted

### Public Form Flow

1. Customer visits public form URL
2. System checks if form is published and current
3. Customer fills and submits form with email
4. Submission is stored with contact info
5. Customer can view their submission using submissionId + email

### Submission Rules

- One submission per email per form version
- If form version changes, same email can submit again
- Contact is created on first submission, reused for subsequent forms

## Input Validation

All endpoints validate input and return appropriate error responses:

- **400 Bad Request**: Missing or invalid input data
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## Features Implemented

- [x] Company CRUD
- [x] User CRUD
- [x] Soft delete pattern
- [x] UUID-based public identifiers
- [x] Error handling system
- [x] Input validation
- [x] JWT Authentication
  - [x] JWT configuration
  - [x] Auth service (login/logout)
  - [x] Auth controller
  - [x] Auth routes
  - [x] Auth middleware
  - [x] Protected routes
- [x] Role-based authorization
- [x] Form CRUD
  - [x] Create form
  - [x] List forms by company
  - [x] Get form by ID
  - [x] Update form (versioning)
  - [x] Delete form (soft delete)
  - [x] Version history
- [x] Public Form API
  - [x] View public form
  - [x] Submit form
  - [x] View own submission
- [x] Admin Submissions API
  - [x] List submissions
  - [x] View submission details
  - [x] Delete submission (admin only)
- [x] File Upload System
  - [x] Pre-validation endpoint
  - [x] File upload endpoint
  - [x] Per-field size and type limits
  - [x] Organized storage by form ID

## Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```