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
exports.deleteCompany = exports.updateCompany = exports.getCompany = exports.listCompanies = exports.createCompany = void 0;
const companyService = __importStar(require("../services/company-service"));
/**
 * Create a new company
 * POST /api/v1/companies
 */
const createCompany = async (req, res, next) => {
    try {
        const company = await companyService.createNewCompany(req.body);
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            data: company,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCompany = createCompany;
/**
 * List all companies
 * GET /api/v1/companies
 */
const listCompanies = async (req, res, next) => {
    try {
        const companies = await companyService.getAllCompanies();
        res.status(200).json({
            success: true,
            data: companies,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.listCompanies = listCompanies;
/**
 * Get single company by publicId
 * GET /api/v1/companies/:id
 */
const getCompany = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const company = await companyService.getCompanyById(companyId);
        if (!company) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: company,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCompany = getCompany;
/**
 * Update company
 * PATCH /api/v1/companies/:id
 */
const updateCompany = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const updateData = req.body;
        // Do not allow empty updates
        if (!updateData || Object.keys(updateData).length === 0) {
            res.status(400).json({
                success: false,
                message: 'No update data provided',
            });
            return;
        }
        const updatedCompany = await companyService.updateCompany(companyId, updateData);
        if (!updatedCompany) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            data: updatedCompany,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCompany = updateCompany;
/**
 * Soft delete company
 * DELETE /api/v1/companies/:id
 */
const deleteCompany = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const deleted = await companyService.deleteCompany(companyId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: 'Company not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCompany = deleteCompany;
