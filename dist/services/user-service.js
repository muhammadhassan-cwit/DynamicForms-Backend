"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.getUserById = exports.getUsersByCompany = exports.createUser = void 0;
const db_client_1 = require("../config/db-client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const bad_request_error_1 = require("../errors/bad-request-error");
const not_found_error_1 = require("../errors/not-found-error");
const createUser = async (input) => {
    const { companyId, email, password, role, fullName } = input;
    //  Required field validation
    if (!companyId) {
        throw new bad_request_error_1.BadRequestError('Company ID is required');
    }
    if (!email || email.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Email is required');
    }
    if (!password || password.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Password is required');
    }
    //  Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    //  Check company existence
    const company = await db_client_1.prisma.company.findUnique({
        where: { publicId: companyId },
        select: { id: true },
    });
    if (!company) {
        throw new not_found_error_1.NotFoundError('Company not found');
    }
    // Hash password
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    //  Create user
    try {
        return await db_client_1.prisma.user.create({
            data: {
                companyId: company.id,
                email: normalizedEmail,
                passwordHash,
                fullName,
                role: role || 'employee',
                isActive: true,
            },
        });
    }
    catch (error) {
        // Unique constraint violation (email per company)
        if (error.code === 'P2002') {
            throw new bad_request_error_1.BadRequestError('A user with this email already exists in the company');
        }
        throw error;
    }
};
exports.createUser = createUser;
const getUsersByCompany = async (companyId) => {
    //  Validate input
    if (!companyId) {
        throw new bad_request_error_1.BadRequestError('Company ID is required');
    }
    //  Check company existence
    const company = await db_client_1.prisma.company.findUnique({
        where: { publicId: companyId },
        select: { id: true },
    });
    if (!company) {
        throw new not_found_error_1.NotFoundError('Company not found');
    }
    //  Fetch users
    return db_client_1.prisma.user.findMany({
        where: {
            companyId: company.id,
            isDeleted: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getUsersByCompany = getUsersByCompany;
const getUserById = async (userId) => {
    if (!userId) {
        throw new bad_request_error_1.BadRequestError('User ID is required');
    }
    const user = await db_client_1.prisma.user.findUnique({
        where: { publicId: userId },
    });
    if (!user || user.isDeleted) {
        return null;
    }
    return user;
};
exports.getUserById = getUserById;
const deactivateUser = async (userId) => {
    if (!userId) {
        throw new bad_request_error_1.BadRequestError('User ID is required');
    }
    const user = await db_client_1.prisma.user.findUnique({
        where: { publicId: userId },
    });
    if (!user || user.isDeleted || user.isActive === false) {
        return false;
    }
    await db_client_1.prisma.user.update({
        where: { publicId: userId },
        data: {
            isActive: false,
        },
    });
    return true;
};
exports.deactivateUser = deactivateUser;
