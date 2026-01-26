import { prisma } from '../config/db-client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';


interface CreateUserInput {
  companyId: string; // UUID
  email: string;
  password: string;
  role?: string;
  fullName?: string;
}

export const createUser = async (
  input: CreateUserInput
): Promise<User> => {
  const { companyId, email, password, role, fullName } = input;

  //  Required field validation
  if (!companyId) {
    throw new BadRequestError('Company ID is required');
  }

  if (!email || email.trim() === '') {
    throw new BadRequestError('Email is required');
  }

  if (!password || password.trim() === '') {
    throw new BadRequestError('Password is required');
  }

  //  Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  //  Check company existence
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
    select: { id: true },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  //  Create user
  try {
    return await prisma.user.create({
      data: {
        companyId: company.id,
        email: normalizedEmail,
        passwordHash,
        fullName,
        role: role || 'employee',
        isActive: true,
      },
    });
  } catch (error: any) {
    // Unique constraint violation (email per company)
    if (error.code === 'P2002') {
      throw new BadRequestError(
        'A user with this email already exists in the company'
      );
    }

    throw error;
  }
};

export const getUsersByCompany = async (
  companyId: string
): Promise<User[]> => {
  //  Validate input
  if (!companyId) {
    throw new BadRequestError('Company ID is required');
  }

  //  Check company existence
  const company = await prisma.company.findUnique({
    where: { publicId: companyId },
    select: { id: true },
  });

  if (!company) {
    throw new NotFoundError('Company not found');
  }

  //  Fetch users
  return prisma.user.findMany({
    where: {
      companyId: company.id,
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getUserById = async (
  userId: string
): Promise<User | null> => {
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const user = await prisma.user.findUnique({
    where: { publicId: userId },
  });

  if (!user || user.isDeleted) {
    return null;
  }

  return user;
};

export const deactivateUser = async (
  userId: string
): Promise<boolean> => {
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const user = await prisma.user.findUnique({
    where: { publicId: userId },
  });

  if (!user || user.isDeleted || user.isActive === false) {
    return false;
  }

  await prisma.user.update({
    where: { publicId: userId },
    data: {
      isActive: false,
    },
  });

  return true;
};

