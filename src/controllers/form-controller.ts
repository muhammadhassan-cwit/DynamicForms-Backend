import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth-middleware';
import * as formService from '../services/form-service';


export const createForm = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { title, description, structureSchema, config, isPublished } = req.body;  // ADD isPublished

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!structureSchema) {
      return res.status(400).json({
        success: false,
        message: 'Structure schema is required',
      });
    }

    if (!Array.isArray(structureSchema)) {
      return res.status(400).json({
        success: false,
        message: 'Structure schema must be an array of fields',
      });
    }

    const form = await formService.createForm(companyId, {
      title,
      description,
      structureSchema,
      config,
      isPublished,  // ADD THIS
    });

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};


export const getFormsByCompany = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const forms = await formService.getFormsByCompany(companyId);

    res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};


export const getFormById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    const form = await formService.getFormById(formId);

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};


export const updateForm = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    const { title, description, structureSchema, config, isPublished, isMajorChange } = req.body;

    if (!title && description === undefined && !structureSchema && !config && isPublished === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field is required to update',
      });
    }

    if (structureSchema && !Array.isArray(structureSchema)) {
      return res.status(400).json({
        success: false,
        message: 'Structure schema must be an array of fields',
      });
    }

    const form = await formService.updateForm(formId, {
      title,
      description,
      structureSchema,
      config,
      isPublished,
      isMajorChange,
    });

    res.status(200).json({
      success: true,
      message: 'Form updated successfully',
      data: form,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteForm = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    const result = await formService.deleteForm(formId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};


export const getFormVersions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    const versions = await formService.getFormVersions(formId);

    res.status(200).json({
      success: true,
      data: versions,
    });
  } catch (error) {
    next(error);
  }
};