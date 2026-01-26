import {Router} from 'express';
import {
    createUser, 
    listUsersByCompany,
    getUser,
    deactivateUser,
} from '../controllers/user-controller';
import { validateUuidParam } from '../middlewares/validate-uuid-param';

const router = Router();

router.post(
    '/companies/:companyId/users',
    validateUuidParam('companyId'),
    createUser
);

router.get(
    '/companies/:companyId/users',
    validateUuidParam('companyId'),
    listUsersByCompany
);

router.get(
    '/users/:userId',
    validateUuidParam('userId'),
    getUser
);

router.patch(
    '/users/:userId/deactivate',
    validateUuidParam('userId'),
    deactivateUser
);

export default router;