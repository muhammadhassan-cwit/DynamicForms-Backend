"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const http_error_1 = require("./errors/http-error");
// Routes
const company_routes_1 = __importDefault(require("./routes/company-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const app = (0, express_1.default)();
const API_V1 = '/api/v1';
// 1. MIDDLEWARES (Security & Parsing)
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// 3. APP ROUTES
app.get('/', (req, res) => {
    res.send('DynamicForms Backend is Running 🚀');
});
// API Routes
app.use(`${API_V1}/companies`, company_routes_1.default);
app.use(API_V1, user_routes_1.default);
app.use((err, req, res, next) => {
    if (err instanceof http_error_1.HttpError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});
exports.default = app;
