import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './config/db-client';
import cron from 'node-cron';
import { cleanupTempFiles } from './utils/file-utils';

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    
    await prisma.$connect();
    console.log('✅ Connected to Database');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    cleanupTempFiles(24);
    console.log('🧹 Startup temp cleanup complete');

    cron.schedule('0 * * * *', () => {
      console.log('🧹 Running scheduled temp cleanup...');
      cleanupTempFiles(24);
      console.log('🧹 Scheduled temp cleanup complete');
    });

    console.log('⏰ Temp cleanup cron scheduled (every hour)');

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

main();