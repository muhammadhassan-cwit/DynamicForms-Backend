"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.getUser = exports.listUsersByCompany = exports.createUser = void 0;
const userService = __importStar(require("../services/user-service"));
const not_found_error_1 = require("../errors/not-found-error");
/**
 * Create a new user under a company
 * POST /companies/:companyId/users
 */
const createUser = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const { email, password, role, fullName } = req.body;
        const user = await userService.createUser({
            companyId,
            email,
            password,
            role,
            fullName,
        });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: user.publicId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
/**
 * List users of a company
 * GET /companies/:companyId/users
 */
const listUsersByCompany = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const users = await userService.getUsersByCompany(companyId);
        res.status(200).json({
            success: true,
            data: users.map((user) => ({
                id: user.publicId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listUsersByCompany = listUsersByCompany;
/**
 * Get single user by ID
 * GET /users/:userId
 */
const getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new not_found_error_1.NotFoundError('User not found');
        }
        res.status(200).json({
            success: true,
            data: {
                id: user.publicId,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
/**
 * Deactivate user
 * PATCH /users/:userId/deactivate
 */
const deactivateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deactivated = await userService.deactivateUser(userId);
        if (!deactivated) {
            throw new not_found_error_1.NotFoundError('User not found');
        }
        res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateUser = deactivateUser;
