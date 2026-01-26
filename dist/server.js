"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_client_1 = require("./config/db-client");
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        // 1. Connect to Database
        // Prisma connects lazily, but running a query ensures it's working.
        await db_client_1.prisma.$connect();
        console.log('✅ Connected to Database');
        // 2. Start Server
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
main();
