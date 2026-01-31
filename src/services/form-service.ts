import { prisma } from '../config/db-client';
import { NotFoundError } from '../errors/not-found-error';
import { v4 as uuidv4 } from 'uuid';


export const createForm = async (
  companyId: string,
  data: {
    title: string;
    description?: string;
    structureSchema: any;
    config?: any;
  }
) => {
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const parentGroupId = uuidv4();

  const form = await prisma.form.create({
    data: {
      title: data.title,
      description: data.description,
      structureSchema: data.structureSchema,
      config: data.config || {},
      parentGroupId: parentGroupId,
      versionMajor: 1,
      versionMinor: 0,
      isCurrent: true,
      isPublished: false,
    },
  });

  await prisma.companyForm.create({
    data: {
      companyId: company.id,
      formId: form.id,
      isEnabled: true,
    },
  });

  return {
    publicId: form.publicId,
    title: form.title,
    description: form.description,
    structureSchema: form.structureSchema,
    version: `${form.versionMajor}.${form.versionMinor}`,
    isPublished: form.isPublished,
    isCurrent: form.isCurrent,
    company: {
      publicId: company.publicId,
      name: company.name,
    },
    createdAt: form.createdAt,
  };
};


export const getFormsByCompany = async (companyId: string) => {
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const companyForms = await prisma.companyForm.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      form: true,
      company: true,
    },
  });

  const forms = companyForms
    .filter((cf) => cf.form.isCurrent && !cf.form.isDeleted)
    .map((cf) => ({
      publicId: cf.form.publicId,
      title: cf.form.title,
      description: cf.form.description,
      version: `${cf.form.versionMajor}.${cf.form.versionMinor}`,
      isPublished: cf.form.isPublished,
      company: {
        publicId: cf.company.publicId,
        name: cf.company.name,
      },
      createdAt: cf.form.createdAt,
    }));

  return forms;
};


export const getFormById = async (formId: string) => {
  const companyForm = await prisma.companyForm.findFirst({
    where: {
      form: {
        publicId: formId,
        isDeleted: false,
      },
    },
    include: {
      form: true,
      company: true,
    },
  });

  if (!companyForm) {
    throw new NotFoundError('Form not found');
  }

  return {
    publicId: companyForm.form.publicId,
    title: companyForm.form.title,
    description: companyForm.form.description,
    structureSchema: companyForm.form.structureSchema,
    config: companyForm.form.config,
    version: `${companyForm.form.versionMajor}.${companyForm.form.versionMinor}`,
    isPublished: companyForm.form.isPublished,
    isCurrent: companyForm.form.isCurrent,
    company: {
      publicId: companyForm.company.publicId,
      name: companyForm.company.name,
    },
    createdAt: companyForm.form.createdAt,
    updatedAt: companyForm.form.updatedAt,
  };
};


export const updateForm = async (
  formId: string,
  data: {
    title?: string;
    description?: string;
    structureSchema?: any;
    config?: any;
    isPublished?: boolean;
    isMajorChange?: boolean;
  }
) => {
  const companyForm = await prisma.companyForm.findFirst({
    where: {
      form: {
        publicId: formId,
        isCurrent: true,
        isDeleted: false,
      },
    },
    include: {
      form: true,
      company: true,
    },
  });

  if (!companyForm) {
    throw new NotFoundError('Form not found');
  }

  const oldForm = companyForm.form;

  let newMajor = oldForm.versionMajor || 1;
  let newMinor = oldForm.versionMinor || 0;

  if (data.isMajorChange) {
    newMajor += 1;
    newMinor = 0;
  } else {
    newMinor += 1;
  }

  await prisma.form.update({
    where: { id: oldForm.id },
    data: { isCurrent: false },
  });

  const newForm = await prisma.form.create({
    data: {
      title: data.title || oldForm.title,
      description: data.description !== undefined ? data.description : oldForm.description,
      structureSchema: data.structureSchema || oldForm.structureSchema,
      config: data.config || oldForm.config,
      parentGroupId: oldForm.parentGroupId,
      versionMajor: newMajor,
      versionMinor: newMinor,
      isCurrent: true,
      isPublished: data.isPublished !== undefined ? data.isPublished : oldForm.isPublished,
    },
  });

  await prisma.companyForm.create({
    data: {
      companyId: companyForm.companyId,
      formId: newForm.id,
      isEnabled: true,
    },
  });

  return {
    publicId: newForm.publicId,
    title: newForm.title,
    description: newForm.description,
    structureSchema: newForm.structureSchema,
    version: `${newForm.versionMajor}.${newForm.versionMinor}`,
    previousVersion: `${oldForm.versionMajor}.${oldForm.versionMinor}`,
    isPublished: newForm.isPublished,
    isCurrent: newForm.isCurrent,
    company: {
      publicId: companyForm.company.publicId,
      name: companyForm.company.name,
    },
    createdAt: newForm.createdAt,
  };
};


export const deleteForm = async (formId: string) => {
  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
      isCurrent: true,
      isDeleted: false,
    },
  });

  if (!form) {
    throw new NotFoundError('Form not found');
  }

  await prisma.form.update({
    where: { id: form.id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isCurrent: false,
    },
  });

  return { message: 'Form deleted successfully' };
};


export const getFormVersions = async (formId: string) => {
  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
    },
  });

  if (!form || !form.parentGroupId) {
    throw new NotFoundError('Form not found');
  }

  const versions = await prisma.form.findMany({
    where: {
      parentGroupId: form.parentGroupId,
    },
    orderBy: [
      { versionMajor: 'desc' },
      { versionMinor: 'desc' },
    ],
  });

  return versions.map((v) => ({
    publicId: v.publicId,
    title: v.title,
    version: `${v.versionMajor}.${v.versionMinor}`,
    isCurrent: v.isCurrent,
    isDeleted: v.isDeleted,
    createdAt: v.createdAt,
  }));
};