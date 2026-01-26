"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// 1. Declare a global variable to hold the connection
// This prevents creating 100s of connections when you save a file in VS Code (Hot Reload)
const globalForPrisma = global;
// 2. Create the connection (or reuse the existing one if allowed)
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
// 3. Save the connection globally for next time (Development only)
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
// 4. Handle BigInt serialization for JSON responses
BigInt.prototype.toJSON = function () {
    return this.toString();
};
