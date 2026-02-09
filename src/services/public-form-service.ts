import { prisma } from '../config/db-client';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { moveFilesToUploads } from '../utils/file-utils';

export const getPublicForm = async (formId: string) => {
  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
      isDeleted: false,
    },
  });

  if (!form) {
    throw new NotFoundError('Form not found');
  }

  if (!form.isCurrent) {
    throw new NotFoundError('Form version no longer available');
  }

  if (!form.isPublished) {
    throw new NotFoundError('Form not found');
  }

  const companyForm = await prisma.companyForm.findFirst({
    where: {
      formId: form.id,
    },
    include: {
      company: true,
    },
  });

  if (!companyForm) {
    throw new NotFoundError('Form not found');
  }

  return {
    publicId: form.publicId,
    title: form.title,
    description: form.description,
    structureSchema: form.structureSchema,
    company: {
      name: companyForm.company.name,
    },
  };
};

export const submitForm = async (
  formId: string,
  data: {
    email: string;
    fullName?: string;
    responseData: any;
  }
) => {
  if (!data.email) {
    throw new BadRequestError('Email is required');
  }

  if (!data.responseData) {
    throw new BadRequestError('Response data is required');
  }

  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
      isCurrent: true,
      isPublished: true,
      isDeleted: false,
    },
  });

  if (!form) {
    throw new NotFoundError('Form not found or not available');
  }

  const companyForm = await prisma.companyForm.findFirst({
    where: {
      formId: form.id,
    },
    include: {
      company: true,
    },
  });

  if (!companyForm) {
    throw new NotFoundError('Form not found');
  }

  const companyId = companyForm.company.id;

  let contact = await prisma.contact.findFirst({
    where: {
      email: data.email,
      companyId: companyId,
    },
  });

  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        email: data.email,
        fullName: data.fullName || null,
        companyId: companyId,
      },
    });
  }

  const existingSubmission = await prisma.contactForm.findFirst({
    where: {
      contactId: contact.id,
      formId: form.id,
    },
  });

  if (existingSubmission) {
    throw new BadRequestError('You have already submitted this form');
  }

  // Move files from temp to uploads folder
  const finalResponseData = moveFilesToUploads(data.responseData, formId);

  const submission = await prisma.contactForm.create({
    data: {
      contactId: contact.id,
      formId: form.id,
      companyId: companyId,
      responseData: finalResponseData,
      status: 'submitted',
    },
  });

  return {
    submissionId: submission.submissionId,
    message: 'Form submitted successfully',
  };
};

export const getSubmission = async (submissionId: string, email: string) => {
  if (!email) {
    throw new BadRequestError('Email is required');
  }

  const submission = await prisma.contactForm.findFirst({
    where: {
      submissionId: submissionId,
    },
    include: {
      contact: true,
      form: true,
      company: true,
    },
  });

  if (!submission) {
    throw new NotFoundError('Submission not found');
  }

  if (submission.contact.email !== email) {
    throw new NotFoundError('Submission not found');
  }

  if (!submission.form.isCurrent) {
    throw new NotFoundError('Form version no longer available');
  }

  return {
    submissionId: submission.submissionId,
    responseData: submission.responseData,
    status: submission.status,
    submittedAt: submission.submittedAt,
    form: {
      publicId: submission.form.publicId,
      title: submission.form.title,
      description: submission.form.description,
      structureSchema: submission.form.structureSchema,
    },
    company: {
      name: submission.company.name,
    },
  };
};