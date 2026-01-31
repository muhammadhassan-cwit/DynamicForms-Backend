import { Router } from 'express';
import {
  createForm,
  getFormsByCompany,
  getFormById,
  updateForm,
  deleteForm,
  getFormVersions,
} from '../controllers/form-controller';
import { authenticate, authorize } from '../middlewares/auth-middleware';
import { validateUuidParam } from '../middlewares/validate-uuid-param';

const router = Router();

router.post('/', authenticate, authorize('admin'), createForm);

router.get('/', authenticate, getFormsByCompany);

router.get('/:formId', authenticate, validateUuidParam('formId'), getFormById);

router.get('/:formId/versions', authenticate, validateUuidParam('formId'), getFormVersions);

router.patch('/:formId', authenticate, authorize('admin'), validateUuidParam('formId'), updateForm);

router.delete('/:formId', authenticate, authorize('admin'), validateUuidParam('formId'), deleteForm);

export default router;