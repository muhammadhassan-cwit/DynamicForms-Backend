"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUuidParam = void 0;
const uuid_1 = require("uuid");
/**
 * Validates that a route param is a valid UUID.
 * Example usage: validateUuidParam('id')
 */
const validateUuidParam = (paramName) => (req, res, next) => {
    const value = req.params[paramName];
    // Block missing or invalid UUIDs
    if (!value || !(0, uuid_1.validate)(value)) {
        res.status(400).json({
            success: false,
            message: `Invalid ${paramName} format`,
        });
        return;
    }
    next();
};
exports.validateUuidParam = validateUuidParam;
