import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger'; // The configuration we just made
import { HttpError } from './errors/http-error';

// Routes
import companyRoutes from './routes/company-routes';

const app: Application = express();

// ==============================================================================
// 1. MIDDLEWARES (Security & Parsing)
// ==============================================================================
app.use(helmet());
app.use(cors());
app.use(express.json());

// ==============================================================================
// 2. SWAGGER DOCUMENTATION (The Menu)
// Access at: http://localhost:5000/api-docs
// ==============================================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==============================================================================
// 3. APP ROUTES
// ==============================================================================

// Default Route (Sanity Check)
app.get('/', (req: Request, res: Response) => {
  res.send('DynamicForms Backend is Running 🚀');
});

// API Routes
app.use('/api/v1/companies', companyRoutes);

// ==============================================================================
// 4. GLOBAL ERROR HANDLER (Must be last)
// ==============================================================================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Known / expected errors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected / server errors
  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;