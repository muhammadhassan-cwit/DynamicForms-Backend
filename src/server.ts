import app from './app';
import { prisma } from './config/db-client';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // 1. Connect to Database
    // Prisma connects lazily, but running a query ensures it's working.
    await prisma.$connect();
    console.log('✅ Connected to Database');

    // 2. Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();