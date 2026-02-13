import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger'; 
import { HttpError } from './errors/http-error';
import path from 'path';

// Routes
import companyRoutes from './routes/company-routes';
import userRoutes from './routes/user-routes';
import authRoutes from './routes/auth-routes';
import formRoutes from './routes/form-routes';
import publicRoutes from './routes/public-routes';
import submissionRoutes from './routes/submission-routes';
import superAdminRoutes from './routes/super-admin-routes';

const app: Application = express();
const API_V1 = '/api/v1';

// 1. MIDDLEWARES (Security & Parsing)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. APP ROUTES

app.get('/', (req: Request, res: Response) => {
  res.send('DynamicForms Backend is Running 🚀');
});

// API Routes
app.use(`${API_V1}/companies`, companyRoutes);
app.use(API_V1, userRoutes);
app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/forms`, formRoutes);
app.use(`${API_V1}/public`, publicRoutes);
app.use(API_V1, submissionRoutes);
app.use(`${API_V1}/super-admin`, superAdminRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle our custom HttpError
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle body-parser and other errors with statusCode/status
  if (err.statusCode || err.status) {
    return res.status(err.statusCode || err.status).json({
      success: false,
      message: err.message || 'Bad Request',
    });
  }

  // Unknown errors = 500
  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;