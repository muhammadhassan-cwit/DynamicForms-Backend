import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user-service';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';

/**
 * Create a new user under a company
 * POST /companies/:companyId/users
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const { email, password, role, fullName } = req.body;

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
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List users of a company
 * GET /companies/:companyId/users
 */
export const listUsersByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;

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
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * GET /users/:userId
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

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
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate user
 * PATCH /users/:userId/deactivate
 */
export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

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

/**
 * Soft delete user
 * DELETE /users/:userId
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

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
