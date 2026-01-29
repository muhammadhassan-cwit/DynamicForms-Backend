import { Router } from 'express';
import { loginUser, logoutUser } from '../controllers/auth-controller';
import { authenticate } from '../middlewares/auth-middleware';

const router = Router();

router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser);

export default router;