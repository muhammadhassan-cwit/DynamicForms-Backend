import fs from 'fs';
import path from 'path';

/**
 * Move a file from temp folder to uploads folder
 * @param tempPath - Current path like "/temp/formId/filename.jpg"
 * @param formId - Form ID for organizing uploads
 * @returns New path like "/uploads/formId/filename.jpg"
 */
export const moveFileToUploads = (tempPath: string, formId: string): string => {
  // Normalize the path (remove leading slash if present)
  const normalizedTempPath = tempPath.startsWith('/') ? tempPath.slice(1) : tempPath;
  
  // Check if file exists
  if (!fs.existsSync(normalizedTempPath)) {
    throw new Error(`File not found: ${normalizedTempPath}`);
  }

  // Extract filename from path
  const filename = path.basename(normalizedTempPath);

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join('uploads', formId);
  fs.mkdirSync(uploadsDir, { recursive: true });

  // New path in uploads folder
  const newPath = path.join(uploadsDir, filename);

  // Move the file (copy + delete)
  fs.copyFileSync(normalizedTempPath, newPath);
  fs.unlinkSync(normalizedTempPath);

  // Return the public URL path
  return `/${newPath.replace(/\\/g, '/')}`;
};

/**
 * Move multiple files from temp to uploads
 * @param responseData - The form response data containing file paths
 * @param formId - Form ID
 * @returns Updated response data with new file paths
 */
export const moveFilesToUploads = (
  responseData: Record<string, any>,
  formId: string
): Record<string, any> => {
  const updatedData = { ...responseData };

  for (const [key, value] of Object.entries(updatedData)) {
    // Check if value is a temp file path
    if (typeof value === 'string' && value.includes('/temp/')) {
      try {
        updatedData[key] = moveFileToUploads(value, formId);
      } catch (error) {
        console.error(`Failed to move file for field ${key}:`, error);
        // Keep original path if move fails
      }
    }
  }

  return updatedData;
};

/**
 * Delete a file
 * @param filePath - Path to the file
 */
export const deleteFile = (filePath: string): void => {
  try {
    const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
    }
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
};

/**
 * Clean up old temp files (older than specified hours)
 * @param maxAgeHours - Maximum age in hours (default 24)
 */
export const cleanupTempFiles = (maxAgeHours: number = 24): void => {
  const tempDir = 'temp';
  
  if (!fs.existsSync(tempDir)) {
    return;
  }

  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  const now = Date.now();

  const cleanDirectory = (dirPath: string) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        cleanDirectory(fullPath);
        // Remove empty directories
        const remaining = fs.readdirSync(fullPath);
        if (remaining.length === 0) {
          fs.rmdirSync(fullPath);
        }
      } else {
        const stats = fs.statSync(fullPath);
        const fileAge = now - stats.mtimeMs;
        if (fileAge > maxAgeMs) {
          fs.unlinkSync(fullPath);
          console.log(`Deleted old temp file: ${fullPath}`);
        }
      }
    }
  };

  cleanDirectory(tempDir);
};