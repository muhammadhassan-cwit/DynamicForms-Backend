import { Request, Response, NextFunction } from 'express';
import * as publicFormService from '../services/public-form-service';

export const getPublicForm = async (
  req: Request,
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

    const form = await publicFormService.getPublicForm(formId);

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

export const submitForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;
    const { email, fullName, responseData } = req.body;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!responseData) {
      return res.status(400).json({
        success: false,
        message: 'Response data is required',
      });
    }

    const result = await publicFormService.submitForm(formId, {
      email,
      fullName,
      responseData,
    });

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        submissionId: result.submissionId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { submissionId } = req.params;
    const { email } = req.query;

    if (!submissionId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const submission = await publicFormService.getSubmission(
      submissionId,
      email as string
    );

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};