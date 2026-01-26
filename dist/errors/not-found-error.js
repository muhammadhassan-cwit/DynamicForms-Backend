"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const http_error_1 = require("./http-error");
class NotFoundError extends http_error_1.HttpError {
    constructor(message) {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
