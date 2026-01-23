import { PrismaClient } from '@prisma/client';

// 1. Declare a global variable to hold the connection
// This prevents creating 100s of connections when you save a file in VS Code (Hot Reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Create the connection (or reuse the existing one if allowed)
export const prisma = globalForPrisma.prisma || new PrismaClient();

// 3. Save the connection globally for next time (Development only)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 4. Handle BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};