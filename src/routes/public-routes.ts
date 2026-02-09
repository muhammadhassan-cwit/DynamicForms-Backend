import { Router } from 'express';
import {
  getPublicForm,
  submitForm,
  getSubmission,
} from '../controllers/public-form-controller';
import { validateUpload, uploadFile } from '../controllers/upload-controller';
import { validateUuidParam } from '../middlewares/validate-uuid-param';
import { upload } from '../config/multer';

const router = Router();

router.get('/forms/:formId', validateUuidParam('formId'), getPublicForm);

router.post('/forms/:formId/submit', validateUuidParam('formId'), submitForm);

router.post('/forms/:formId/validate-upload', validateUuidParam('formId'), validateUpload);

router.post('/forms/:formId/upload', validateUuidParam('formId'), upload.single('file'), uploadFile);

router.get('/submissions/:submissionId', validateUuidParam('submissionId'), getSubmission);

export default router;