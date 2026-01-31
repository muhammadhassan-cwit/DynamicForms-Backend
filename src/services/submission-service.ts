import { prisma } from '../config/db-client';
import { NotFoundError } from '../errors/not-found-error';

export const listSubmissions = async (formId: string, userCompanyId: string) => {
  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
      isDeleted: false,
    },
  });

  if (!form) {
    throw new NotFoundError('Form not found');
  }

  const company = await prisma.company.findFirst({
    where: {
      publicId: userCompanyId,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const companyForm = await prisma.companyForm.findFirst({
    where: {
      formId: form.id,
      companyId: company.id,
    },
  });

  if (!companyForm) {
    throw new NotFoundError('Form not found');
  }

  const submissions = await prisma.contactForm.findMany({
    where: {
      formId: form.id,
      companyId: company.id,
      isDeleted: false,
    },
    include: {
      contact: true,
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });

  return submissions.map((sub) => ({
    submissionId: sub.submissionId,
    contact: {
      email: sub.contact.email,
      fullName: sub.contact.fullName,
    },
    status: sub.status,
    submittedAt: sub.submittedAt,
  }));
};

export const getSubmission = async (submissionId: string, userCompanyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: userCompanyId,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const submission = await prisma.contactForm.findFirst({
    where: {
      submissionId: submissionId,
      isDeleted: false,
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

  if (submission.companyId !== company.id) {
    throw new NotFoundError('Submission not found');
  }

  return {
    submissionId: submission.submissionId,
    contact: {
      email: submission.contact.email,
      fullName: submission.contact.fullName,
    },
    responseData: submission.responseData,
    status: submission.status,
    submittedAt: submission.submittedAt,
    form: {
      publicId: submission.form.publicId,
      title: submission.form.title,
      version: `${submission.form.versionMajor}.${submission.form.versionMinor}`,
    },
  };
};

export const deleteSubmission = async (submissionId: string, userCompanyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: userCompanyId,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const submission = await prisma.contactForm.findFirst({
    where: {
      submissionId: submissionId,
      isDeleted: false,
    },
  });

  if (!submission) {
    throw new NotFoundError('Submission not found');
  }

  if (submission.companyId !== company.id) {
    throw new NotFoundError('Submission not found');
  }

  await prisma.contactForm.update({
    where: {
      id: submission.id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return { message: 'Submission deleted successfully' };
};