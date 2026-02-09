import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { BadRequestError } from '../errors/bad-request-error';

const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
];

const ALL_ALLOWED_TYPES = [...IMAGE_TYPES, ...FILE_TYPES];

const DEFAULT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const DEFAULT_FILE_MAX_SIZE = 10 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const formId = req.params.formId;
    // Upload to temp folder instead of uploads
    const uploadPath = path.join('temp', formId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALL_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`File type '${file.mimetype}' is not allowed`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: DEFAULT_FILE_MAX_SIZE,
  },
});

export {
  upload,
  IMAGE_TYPES,
  FILE_TYPES,
  ALL_ALLOWED_TYPES,
  DEFAULT_IMAGE_MAX_SIZE,
  DEFAULT_FILE_MAX_SIZE,
};