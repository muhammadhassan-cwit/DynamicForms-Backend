import { Request, Response, NextFunction } from 'express';
import { validate as isUuid } from 'uuid';


export const validateUuidParam =
  (paramName: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName];

    if (!value || !isUuid(value)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
      return;
    }

    next();
  };
