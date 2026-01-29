import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth-service';

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Login Successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};

export const logoutUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.body;

        const result = await authService.logout(userId);

        res.status(200).json({
            success: true,
            message: 'Logout Successful',  
            data: result,
        });
    } catch (error) {
        next(error);
    }
};