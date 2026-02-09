import fs from 'fs';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { prisma } from '../config/db-client';
import {
  IMAGE_TYPES,
  FILE_TYPES,
  DEFAULT_IMAGE_MAX_SIZE,
  DEFAULT_FILE_MAX_SIZE,
} from '../config/multer';

const getDefaultMaxSize = (fieldType: string): number => {
  if (fieldType === 'image') return DEFAULT_IMAGE_MAX_SIZE;
  return DEFAULT_FILE_MAX_SIZE;
};

const getDefaultAllowedTypes = (fieldType: string): string[] => {
  if (fieldType === 'image') return IMAGE_TYPES;
  return FILE_TYPES;
};

const getFormField = async (formId: string, fieldId: string) => {
  const form = await prisma.form.findFirst({
    where: {
      publicId: formId,
      isCurrent: true,
      isPublished: true,
      isDeleted: false,
    },
  });

  if (!form) {
    throw new NotFoundError('Form not found or not available');
  }

  const schema = form.structureSchema as any[];
  const field = schema.find((f: any) => f.id === fieldId);

  if (!field) {
    throw new BadRequestError(`Field '${fieldId}' not found in this form`);
  }

  if (field.type !== 'file' && field.type !== 'image') {
    throw new BadRequestError(`Field '${fieldId}' is not a file or image field`);
  }

  return field;
};

export const validateUpload = async (
  formId: string,
  data: { fieldId: string; fileSize: number; mimeType: string }
) => {
  const field = await getFormField(formId, data.fieldId);

  const maxSize = field.maxSize || getDefaultMaxSize(field.type);
  if (data.fileSize > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
    throw new BadRequestError(`File size exceeds the limit of ${maxMB}MB`);
  }

  const allowedTypes = field.allowedTypes || getDefaultAllowedTypes(field.type);
  if (!allowedTypes.includes(data.mimeType)) {
    throw new BadRequestError(`File type '${data.mimeType}' is not allowed for this field`);
  }

  return {
    allowed: true,
    maxSize,
    allowedTypes,
  };
};

export const processUpload = async (
  formId: string,
  fieldId: string,
  file: Express.Multer.File
) => {
  const field = await getFormField(formId, fieldId);

  const maxSize = field.maxSize || getDefaultMaxSize(field.type);
  if (file.size > maxSize) {
    deleteFile(file.path);
    const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
    throw new BadRequestError(`File size exceeds the limit of ${maxMB}MB`);
  }

  const allowedTypes = field.allowedTypes || getDefaultAllowedTypes(field.type);
  if (!allowedTypes.includes(file.mimetype)) {
    deleteFile(file.path);
    throw new BadRequestError(`File type '${file.mimetype}' is not allowed for this field`);
  }

  // Return temp file path (will be moved to uploads on successful submission)
  const filePath = `/${file.path.replace(/\\/g, '/')}`;

  return {
    filePath,
    originalName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
  };
};

const deleteFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {}
};