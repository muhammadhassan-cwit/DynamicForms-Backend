import { Router } from 'express';
import {
  getPublicForm,
  submitForm,
  getSubmission,
} from '../controllers/public-form-controller';
import { validateUuidParam } from '../middlewares/validate-uuid-param';

const router = Router();

router.get('/forms/:formId', validateUuidParam('formId'), getPublicForm);

router.post('/forms/:formId/submit', validateUuidParam('formId'), submitForm);

router.get('/submissions/:submissionId', validateUuidParam('submissionId'), getSubmission);

export default router;