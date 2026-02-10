import { prisma } from '../config/db-client';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import bcrypt from 'bcrypt';

// Get all companies
export const getAllCompanies = async () => {
  const companies = await prisma.company.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return companies.map((company) => ({
    publicId: company.publicId,
    name: company.name,
    domain: company.domain,
    address: company.address,
    timezone: company.timezone,
    themeConfig: company.themeConfig,
    settingsMetadata: company.settingsMetadata,
    isActive: company.isActive,
    createdAt: company.createdAt,
  }));
};

// Get single company with details
export const getCompanyById = async (companyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
    include: {
      users: {
        where: { isDeleted: false },
        select: {
          publicId: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          companyForms: true,
          contactForms: true,
          contacts: true,
        },
      },
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  return {
    publicId: company.publicId,
    name: company.name,
    domain: company.domain,
    address: company.address,
    timezone: company.timezone,
    themeConfig: company.themeConfig,
    settingsMetadata: company.settingsMetadata,
    isActive: company.isActive,
    createdAt: company.createdAt,
    users: company.users,
    stats: {
      totalForms: company._count.companyForms,
      totalSubmissions: company._count.contactForms,
      totalContacts: company._count.contacts,
    },
  };
};

// Create new company
export const createCompany = async (data: {
  name: string;
  domain: string;
  address?: string;
  timezone?: string;
  themeConfig?: object;
  settingsMetadata?: object;
}) => {
  // Check if domain already exists
  const existingCompany = await prisma.company.findUnique({
    where: { domain: data.domain },
  });

  if (existingCompany) {
    throw new BadRequestError('Company with this domain already exists');
  }

  const company = await prisma.company.create({
    data: {
      name: data.name,
      domain: data.domain,
      address: data.address,
      timezone: data.timezone,
      themeConfig: data.themeConfig ?? undefined,
      settingsMetadata: data.settingsMetadata ?? undefined,
    },
  });

  return {
    publicId: company.publicId,
    name: company.name,
    domain: company.domain,
    address: company.address,
    timezone: company.timezone,
    themeConfig: company.themeConfig,
    settingsMetadata: company.settingsMetadata,
    isActive: company.isActive,
    createdAt: company.createdAt,
  };
};

// Update company
export const updateCompany = async (
  companyId: string,
  data: {
    name?: string;
    domain?: string;
    address?: string;
    isActive?: boolean;
    timezone?: string;
    themeConfig?: object;
    settingsMetadata?: object;
  }
) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  // Check domain uniqueness if updating domain
  if (data.domain && data.domain !== company.domain) {
    const existingCompany = await prisma.company.findUnique({
      where: { domain: data.domain },
    });

    if (existingCompany) {
      throw new BadRequestError('Company with this domain already exists');
    }
  }

  const updatedCompany = await prisma.company.update({
    where: { id: company.id },
    data: {
      name: data.name ?? company.name,
      domain: data.domain ?? company.domain,
      address: data.address ?? company.address,
      isActive: data.isActive ?? company.isActive,
      timezone: data.timezone ?? company.timezone,
      themeConfig: data.themeConfig ?? company.themeConfig ?? undefined,
      settingsMetadata: data.settingsMetadata ?? company.settingsMetadata ?? undefined,
    },
  });

  return {
    publicId: updatedCompany.publicId,
    name: updatedCompany.name,
    domain: updatedCompany.domain,
    address: updatedCompany.address,
    timezone: updatedCompany.timezone,
    themeConfig: updatedCompany.themeConfig,
    settingsMetadata: updatedCompany.settingsMetadata,
    isActive: updatedCompany.isActive,
    createdAt: updatedCompany.createdAt,
  };
};

// Delete company (soft delete)
export const deleteCompany = async (companyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  await prisma.company.update({
    where: { id: company.id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return { message: 'Company deleted successfully' };
};

// Get users for a company
export const getCompanyUsers = async (companyId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const users = await prisma.user.findMany({
    where: {
      companyId: company.id,
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map((user) => ({
    publicId: user.publicId,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  }));
};

// Create user for a company
export const createCompanyUser = async (
  companyId: string,
  data: {
    email: string;
    password: string;
    fullName?: string;
    role?: string;
  }
) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  // Check if email already exists in this company
  const existingUser = await prisma.user.findFirst({
    where: {
      companyId: company.id,
      email: data.email,
    },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists in this company');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      email: data.email,
      passwordHash: hashedPassword,
      fullName: data.fullName,
      role: data.role || 'employee',
      isSuperAdmin: false,
    },
  });

  return {
    publicId: user.publicId,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    company: {
      publicId: company.publicId,
      name: company.name,
    },
  };
};

// Delete user from a company (soft delete)
export const deleteCompanyUser = async (companyId: string, userId: string) => {
  const company = await prisma.company.findFirst({
    where: {
      publicId: companyId,
      isDeleted: false,
    },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  const user = await prisma.user.findFirst({
    where: {
      publicId: userId,
      companyId: company.id,
      isDeleted: false,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found in this company');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isDeleted: true,
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return { message: 'User deleted successfully' };
};

// Get platform statistics
export const getPlatformStats = async () => {
  const [
    totalCompanies,
    activeCompanies,
    totalUsers,
    totalForms,
    totalSubmissions,
  ] = await Promise.all([
    prisma.company.count({ where: { isDeleted: false } }),
    prisma.company.count({ where: { isDeleted: false, isActive: true } }),
    prisma.user.count({ where: { isDeleted: false, isSuperAdmin: false } }),
    prisma.form.count({ where: { isDeleted: false, isCurrent: true } }),
    prisma.contactForm.count({ where: { isDeleted: false } }),
  ]);

  return {
    totalCompanies,
    activeCompanies,
    totalUsers,
    totalForms,
    totalSubmissions,
  };
};
