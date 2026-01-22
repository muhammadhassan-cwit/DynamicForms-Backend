import { prisma } from '../config/db-client';
import { Company } from '@prisma/client';
import { BadRequestError } from '../errors/bad-request-error';  

// Define the input shape for creating a company
interface CreateCompanyInput {
  name: string;
  domain: string;
  address: string;
  timezone?: string;
}

export const createNewCompany = async (
  data: CreateCompanyInput
): Promise<Company> => {

  // ❗ Required fields validation
  if (!data.name || data.name.trim() === '') {
    throw new BadRequestError('Company name is required');
  }

  if (!data.domain || data.domain.trim() === '') {
    throw new BadRequestError('Company domain is required');
  }

  if (!data.address || data.address.trim() === '') {
    throw new BadRequestError('Company address is required');
  }

  // ❗ Timezone is OPTIONAL
  // If provided, it must not be empty
  if (data.timezone !== undefined && data.timezone.trim() === '') {
    throw new BadRequestError('Company timezone cannot be empty');
  }

  // ❗ Check uniqueness
  const existing = await prisma.company.findUnique({
    where: { domain: data.domain },
  });

  if (existing) {
    throw new BadRequestError(
      `Domain "${data.domain}" is already registered.`
    );
  }

  // ❗ Persist company in UTC
  return prisma.company.create({
    data: {
      name: data.name,
      domain: data.domain,
      address: data.address,
      timezone: 'UTC', // always normalized
    },
  });
};

/**
 * Retrieves all active companies.
 */
export const getAllCompanies = async (): Promise<Company[]> => {
  return await prisma.company.findMany({
    where: { isDeleted: { not: true } },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get a single company by its Public ID (UUID).
 * We use 'findUnique' because publicId is unique in the database.
 */
export const getCompanyById = async (companyId: string): Promise<Company | null> => {
  return await prisma.company.findUnique({
    where: { publicId: companyId }
  });
};

//update company
export const updateCompany = async (
  companyId: string,
  data: Partial<CreateCompanyInput>
): Promise<Company | null> => {

  // ❗ Validate update fields (empty strings not allowed)
if (data.name !== undefined && data.name.trim() === '') {
  throw new BadRequestError('Company name cannot be empty');
}

if (data.domain !== undefined && data.domain.trim() === '') {
  throw new BadRequestError('Company domain cannot be empty');
}

if (data.address !== undefined && data.address.trim() === '') {
  throw new BadRequestError('Company address cannot be empty');
}

if (data.timezone !== undefined && data.timezone.trim() === '') {
  throw new BadRequestError('Company timezone cannot be empty');
}


  // 1️⃣ Check existence first
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
  });

  // 2️⃣ If not found, return null (no exception)
  if (!company || company.isDeleted) {
    return null;
  }

  // 3️⃣ Perform update
  const updatedCompany = await prisma.company.update({
    where: { publicId: companyId },
    data: {
      name: data.name,
      domain: data.domain,
      address: data.address,
      timezone: data.timezone,
    },
  });

  return updatedCompany;
};


//softDelete
export const deleteCompany = async (companyId: string): Promise<boolean> => {

  // 1️⃣ Find company
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
  });

  // 2️⃣ If not found or already deleted
  if (!company || company.isDeleted) {
    return false;
  }

  // 3️⃣ Soft delete
  await prisma.company.update({
    where: { publicId: companyId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return true;
};
