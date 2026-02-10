import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth-middleware';
import * as superAdminService from '../services/super-admin-service';

// GET /super-admin/companies
export const getAllCompanies = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await superAdminService.getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// GET /super-admin/companies/:companyId
export const getCompanyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const company = await superAdminService.getCompanyById(companyId);
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// POST /super-admin/companies
export const createCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, domain, address } = req.body;

    if (!name || !domain) {
      return res.status(400).json({
        success: false,
        message: 'Name and domain are required',
      });
    }

    const company = await superAdminService.createCompany({
      name,
      domain,
      address,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /super-admin/companies/:companyId
export const updateCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const { name, domain, address, isActive } = req.body;

    const company = await superAdminService.updateCompany(companyId, {
      name,
      domain,
      address,
      isActive,
    });

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /super-admin/companies/:companyId
export const deleteCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const result = await superAdminService.deleteCompany(companyId);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// GET /super-admin/companies/:companyId/users
export const getCompanyUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const users = await superAdminService.getCompanyUsers(companyId);
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// POST /super-admin/companies/:companyId/users
export const createCompanyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const { email, password, fullName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await superAdminService.createCompanyUser(companyId, {
      email,
      password,
      fullName,
      role,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// GET /super-admin/stats
export const getPlatformStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await superAdminService.getPlatformStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
