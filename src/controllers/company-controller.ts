import { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/company-service';


export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, domain } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required',
      });
    }

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


export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;

    // Validation
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

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


export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;
    const updateData = req.body;

    // Validation
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

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


export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.params.id;

    // Validation
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

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
