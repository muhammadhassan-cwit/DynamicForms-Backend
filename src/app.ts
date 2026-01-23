import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger'; 
import { HttpError } from './errors/http-error';

// Routes
import companyRoutes from './routes/company-routes';

const app: Application = express();
const API_V1 = '/api/v1';

// 1. MIDDLEWARES (Security & Parsing)
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. APP ROUTES

app.get('/', (req: Request, res: Response) => {
  res.send('DynamicForms Backend is Running 🚀');
});

// API Routes
app.use(`${API_V1}/companies`, companyRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;