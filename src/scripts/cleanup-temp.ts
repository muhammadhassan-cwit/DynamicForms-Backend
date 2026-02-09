import { cleanupTempFiles } from '../utils/file-utils';

// Run cleanup for files older than 24 hours
console.log('Starting temp file cleanup...');
cleanupTempFiles(24);
console.log('Temp file cleanup complete.');
