"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum([
        'TODO',
        'IN_PROGRESS',
        'COMPLETED',
    ]).optional(),
    priority: zod_1.z.enum([
        'LOW',
        'MEDIUM',
        'HIGH',
    ]).optional(),
    dueDate: zod_1.z.coerce.date().optional().nullable(),
});
exports.updateTaskSchema = exports.createTaskSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, 'At least one field is required');
