import { Request, Response, NextFunction } from 'express';
import { validate as isUuid } from 'uuid';

/**
 * Validates that a route param is a valid UUID.
 * Example usage: validateUuidParam('id')
 */
export const validateUuidParam =
  (paramName: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];

    // Block missing or invalid UUIDs
    if (!value || !isUuid(value)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
      return;
    }

    next();
  };
