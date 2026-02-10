import { prisma } from '../config/db-client';
import bcrypt from 'bcrypt';

async function seedSuperAdmin() {
  const email = 'hassan@superadmin.com';
  const password = 'SuperAdmin@123';
  
  // Check if already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Super admin already exists. Updating isSuperAdmin to true...');
    await prisma.user.update({
      where: { email },
      data: { isSuperAdmin: true },
    });
    console.log('Done!');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create super admin
  const superAdmin = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      fullName: 'Muhammad Hassan',
      role: 'superadmin',
      isSuperAdmin: true,
      companyId: null,
    },
  });

  console.log('========================================');
  console.log('Super admin created successfully!');
  console.log('========================================');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('========================================');
}

seedSuperAdmin()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });