"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_uuid_param_1 = require("../middlewares/validate-uuid-param");
const express_1 = require("express");
const company_controller_1 = require("../controllers/company-controller");
const router = (0, express_1.Router)();
// ==============================================================================
// COMPANY ROUTES
// Base URL: /api/v1/companies
// ==============================================================================
/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - domain
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tech Corp
 *               domain:
 *                 type: string
 *                 example: techcorp.com
 *               address:
 *                 type: string
 *                 example: Silicon Valley
 *               timezone:
 *                 type: string
 *                 example: UTC
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Domain already exists
 *
 *   get:
 *     summary: List all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: A list of companies
 */
router.post('/', company_controller_1.createCompany);
router.get('/', company_controller_1.listCompanies);
/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get a company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The company public ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 *       400:
 *         description: Invalid company ID format
 *
 *   patch:
 *     summary: Update company details
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company public ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Company Name
 *               domain:
 *                 type: string
 *                 example: updated-domain.com
 *               address:
 *                 type: string
 *                 example: New Address
 *               timezone:
 *                 type: string
 *                 example: UTC
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Invalid input or empty update data
 *       404:
 *         description: Company not found
 *
 *   delete:
 *     summary: Soft delete company
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       400:
 *         description: Invalid company ID format
 */
router.get('/:id', (0, validate_uuid_param_1.validateUuidParam)('id'), company_controller_1.getCompany);
router.patch('/:id', (0, validate_uuid_param_1.validateUuidParam)('id'), company_controller_1.updateCompany);
router.delete('/:id', (0, validate_uuid_param_1.validateUuidParam)('id'), company_controller_1.deleteCompany);
exports.default = router;
