import { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/company-service';

/**
 * Create a new company
 * POST /api/v1/companies
 */
export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await companyService.createNewCompany(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all companies
 * GET /api/v1/companies
 */
export const listCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await companyService.getAllCompanies();

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single company by publicId
 * GET /api/v1/companies/:id
 */
export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;

    const company = await companyService.getCompanyById(companyId);

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update company
 * PATCH /api/v1/companies/:id
 */
export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;
    const updateData = req.body;

    // 🚫 Do not allow empty updates
    if (!updateData || Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'No update data provided',
      });
      return;
    }

    const updatedCompany = await companyService.updateCompany(
      companyId,
      updateData
    );

    if (!updatedCompany) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete company
 * DELETE /api/v1/companies/:id
 */
export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;

    const deleted = await companyService.deleteCompany(companyId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
