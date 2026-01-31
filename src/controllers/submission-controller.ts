import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth-middleware';
import * as submissionService from '../services/submission-service';

export const listSubmissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formId } = req.params;
    const userCompanyId = req.user?.companyId;

    if (!formId) {
      return res.status(400).json({
        success: false,
        message: 'Form ID is required',
      });
    }

    if (!userCompanyId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const submissions = await submissionService.listSubmissions(formId, userCompanyId);

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { submissionId } = req.params;
    const userCompanyId = req.user?.companyId;

    if (!submissionId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required',
      });
    }

    if (!userCompanyId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const submission = await submissionService.getSubmission(submissionId, userCompanyId);

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { submissionId } = req.params;
    const userCompanyId = req.user?.companyId;

    if (!submissionId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required',
      });
    }

    if (!userCompanyId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const result = await submissionService.deleteSubmission(submissionId, userCompanyId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};