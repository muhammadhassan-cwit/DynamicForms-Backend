import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth-service';
import { AuthRequest } from '../middlewares/auth-middleware';  

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
    req: AuthRequest,       
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.userId;  

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        await authService.logout(userId);

        res.status(200).json({
            success: true,
            message: 'Logout Successful',
        });
    } catch (error) {
        next(error);
    }
};