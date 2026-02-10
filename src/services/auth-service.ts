import bcrypt from "bcrypt";
import { prisma } from "../config/db-client";
import { generateToken } from "../config/jwt";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      company: {
        select: {
          publicId: true,
          name: true,
        },
      },
    },
  });

  if (!user || user.isDeleted) {
    throw new BadRequestError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new BadRequestError("Your account has been deactivated");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid credentials");
  }

  const tokenPayload = {
    userId: user.publicId,
    email: user.email,
    role: user.role,
    companyId: user.company?.publicId || '',
    isSuperAdmin: user.isSuperAdmin,
  };

  const token = generateToken(tokenPayload);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      token: token,
      lastLoginAt: new Date(),
    },
  });

  return {
    token,
    user: {
      publicId: user.publicId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      company: user.company ? {
        publicId: user.company.publicId,
        name: user.company.name,
      } : null,
    },
  };
};

export const logout = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { publicId: userId },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { token: null },
  });

  return { message: "Logged out successfully" };
};