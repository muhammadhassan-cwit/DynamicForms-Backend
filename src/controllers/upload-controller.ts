import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/upload-service';

export const validateUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;
    const { fieldId, fileSize, mimeType } = req.body;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: 'Field ID is required',
      });
    }

    if (!fileSize || typeof fileSize !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'File size is required and must be a number',
      });
    }

    if (!mimeType) {
      return res.status(400).json({
        success: false,
        message: 'MIME type is required',
      });
    }

    const result = await uploadService.validateUpload(formId, {
      fieldId,
      fileSize,
      mimeType,
    });

    res.status(200).json({
      success: true,
      message: 'File is valid for upload',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;
    const fieldId = req.body.fieldId;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: 'Field ID is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    const result = await uploadService.processUpload(formId, fieldId, req.file);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};