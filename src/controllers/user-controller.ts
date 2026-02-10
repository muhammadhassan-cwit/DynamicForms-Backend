import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user-service';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';


export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const { email, password, role, fullName } = req.body;

    // Validation
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const user = await userService.createUser({
      companyId,
      email,
      password,
      role,
      fullName,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.publicId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        company: user.company ? {
          id: user.company.publicId,
          name: user.company.name,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const listUsersByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;

    // Validation
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    const users = await userService.getUsersByCompany(companyId);

    res.status(200).json({
      success: true,
      data: users.map((user) => ({
        id: user.publicId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        company: user.company ? {
          id: user.company.publicId,
          name: user.company.name,
        } : null,
      })),
    });
  } catch (error) {
    next(error);
  }
};


export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.publicId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        company: user.company ? {
          id: user.company.publicId,
          name: user.company.name,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const deactivated = await userService.deactivateUser(userId);

    if (!deactivated) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    // Validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const deleted = await userService.softDeleteUser(userId);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};