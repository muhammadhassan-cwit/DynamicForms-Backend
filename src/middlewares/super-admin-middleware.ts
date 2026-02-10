import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth-middleware';
import { UnauthorizedError } from '../errors/unauthorized-error';

export const superAdminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isSuperAdmin) {
    throw new UnauthorizedError('Super admin access required');
  }
  next();
};
