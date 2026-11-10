"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const errorMiddleware = (error, req, res, next) => {
    console.error(error);
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Task not found',
            });
            return;
        }
    }
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};
exports.default = errorMiddleware;
