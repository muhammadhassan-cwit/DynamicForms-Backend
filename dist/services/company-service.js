"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getAllCompanies = exports.createNewCompany = void 0;
const db_client_1 = require("../config/db-client");
const bad_request_error_1 = require("../errors/bad-request-error");
const createNewCompany = async (data) => {
    // Required fields validation
    if (!data.name || data.name.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company name is required');
    }
    if (!data.domain || data.domain.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company domain is required');
    }
    if (!data.address || data.address.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company address is required');
    }
    //  Timezone is OPTIONAL
    // If provided, it must not be empty
    if (data.timezone !== undefined && data.timezone.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company timezone cannot be empty');
    }
    //  Check uniqueness
    const existing = await db_client_1.prisma.company.findUnique({
        where: { domain: data.domain },
    });
    if (existing) {
        throw new bad_request_error_1.BadRequestError(`Domain "${data.domain}" is already registered.`);
    }
    //  Persist company in UTC
    return db_client_1.prisma.company.create({
        data: {
            name: data.name,
            domain: data.domain,
            address: data.address,
            timezone: 'UTC', // always normalized
        },
    });
};
exports.createNewCompany = createNewCompany;
/**
 * Retrieves all active companies.
 */
const getAllCompanies = async () => {
    return await db_client_1.prisma.company.findMany({
        where: { isDeleted: { not: true } },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getAllCompanies = getAllCompanies;
/**
 * Get a single company by its Public ID (UUID).
 * We use 'findUnique' because publicId is unique in the database.
 */
const getCompanyById = async (companyId) => {
    return await db_client_1.prisma.company.findUnique({
        where: { publicId: companyId }
    });
};
exports.getCompanyById = getCompanyById;
//update company
const updateCompany = async (companyId, data) => {
    //  Validate update fields (empty strings not allowed)
    if (data.name !== undefined && data.name.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company name cannot be empty');
    }
    if (data.domain !== undefined && data.domain.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company domain cannot be empty');
    }
    if (data.address !== undefined && data.address.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company address cannot be empty');
    }
    if (data.timezone !== undefined && data.timezone.trim() === '') {
        throw new bad_request_error_1.BadRequestError('Company timezone cannot be empty');
    }
    //  Check existence first
    const company = await db_client_1.prisma.company.findUnique({
        where: { publicId: companyId },
    });
    //  If not found, return null (no exception)
    if (!company || company.isDeleted) {
        return null;
    }
    //  Perform update
    const updatedCompany = await db_client_1.prisma.company.update({
        where: { publicId: companyId },
        data: {
            name: data.name,
            domain: data.domain,
            address: data.address,
            timezone: data.timezone,
        },
    });
    return updatedCompany;
};
exports.updateCompany = updateCompany;
//softDelete
const deleteCompany = async (companyId) => {
    //  Find company
    const company = await db_client_1.prisma.company.findUnique({
        where: { publicId: companyId },
    });
    //  If not found or already deleted
    if (!company || company.isDeleted) {
        return false;
    }
    //  Soft delete
    await db_client_1.prisma.company.update({
        where: { publicId: companyId },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            isActive: false,
        },
    });
    return true;
};
exports.deleteCompany = deleteCompany;
