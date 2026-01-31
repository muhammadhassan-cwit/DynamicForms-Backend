import { Router } from 'express';
import {
  listSubmissions,
  getSubmission,
  deleteSubmission,
} from '../controllers/submission-controller';
import { authenticate, authorize } from '../middlewares/auth-middleware';
import { validateUuidParam } from '../middlewares/validate-uuid-param';

const router = Router();

router.get(
  '/forms/:formId/submissions',
  authenticate,
  validateUuidParam('formId'),
  listSubmissions
);

router.get(
  '/submissions/:submissionId',
  authenticate,
  validateUuidParam('submissionId'),
  getSubmission
);

router.delete(
  '/submissions/:submissionId',
  authenticate,
  authorize('admin'),
  validateUuidParam('submissionId'),
  deleteSubmission
);

export default router;