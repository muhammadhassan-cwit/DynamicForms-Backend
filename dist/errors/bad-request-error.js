"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const http_error_1 = require("./http-error");
class BadRequestError extends http_error_1.HttpError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
