"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const error_middlewares_1 = __importDefault(require("./middlewares/error.middlewares"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
}));
app.use(express_1.default.json());
// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'TaskFlow API is running!',
    });
});
// Task routes
app.use('/api/tasks', task_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Global error handler
app.use(error_middlewares_1.default);
exports.default = app;
