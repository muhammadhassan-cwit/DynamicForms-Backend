import { Router } from 'express';
import { authenticate } from '../middlewares/auth-middleware';
import { superAdminMiddleware } from '../middlewares/super-admin-middleware';
import * as superAdminController from '../controllers/super-admin-controller';

const router = Router();

// All routes require auth + super admin
router.use(authenticate);
router.use(superAdminMiddleware);

// Platform stats
router.get('/stats', superAdminController.getPlatformStats);

// Companies
router.get('/companies', superAdminController.getAllCompanies);
router.post('/companies', superAdminController.createCompany);
router.get('/companies/:companyId', superAdminController.getCompanyById);
router.patch('/companies/:companyId', superAdminController.updateCompany);
router.delete('/companies/:companyId', superAdminController.deleteCompany);

// Company users
router.get('/companies/:companyId/users', superAdminController.getCompanyUsers);
router.post('/companies/:companyId/users', superAdminController.createCompanyUser);

export default router;
