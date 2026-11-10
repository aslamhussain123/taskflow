import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),

    description: z.string().optional(),

    status: z.enum([
        'TODO',
        'IN_PROGRESS',
        'COMPLETED',
    ]).optional(),

    priority: z.enum([
        'LOW',
        'MEDIUM',
        'HIGH',
    ]).optional(),

    dueDate: z.coerce.date().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        'At least one field is required',
    );