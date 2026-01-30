import { Router } from 'express';
import {
    createUser, 
    listUsersByCompany,
    getUser,
    deactivateUser,
    deleteUser,
} from '../controllers/user-controller';
import { validateUuidParam } from '../middlewares/validate-uuid-param';
import { authenticate, authorize } from '../middlewares/auth-middleware';

const router = Router();

router.post(
    '/companies/:companyId/users',
    authenticate,
    authorize('admin'),
    validateUuidParam('companyId'),
    createUser
);

router.get(
    '/companies/:companyId/users',
    authenticate,
    validateUuidParam('companyId'),
    listUsersByCompany
);

router.get(
    '/users/:userId',
    authenticate,
    validateUuidParam('userId'),
    getUser
);

router.patch(
    '/users/:userId/deactivate',
    authenticate,
    authorize('admin'),
    validateUuidParam('userId'),
    deactivateUser
);

router.delete(
    '/users/:userId',
    authenticate,
    authorize('admin'),
    validateUuidParam('userId'),
    deleteUser
);

export default router;