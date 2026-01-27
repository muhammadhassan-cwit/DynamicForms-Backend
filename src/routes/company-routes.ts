import { validateUuidParam } from '../middlewares/validate-uuid-param';
import { Router } from 'express';
import {
  createCompany,
  listCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/company-controller';

const router = Router();

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
router.post('/', createCompany);
router.get('/', listCompanies);

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
router.get('/:id', validateUuidParam('id'), getCompany);
router.patch('/:id', validateUuidParam('id'), updateCompany);
router.delete('/:id', validateUuidParam('id'), deleteCompany);

export default router;
