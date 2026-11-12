import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),

    description: z.string().optional(),

    status: z.enum([
        'BACKLOG',
        'TODO',
        'IN_PROGRESS',
        'DONE',
        'CANCELED',
    ]).optional(),

    priority: z.enum([
        'NONE',
        'URGENT',
        'LOW',
        'MEDIUM',
        'HIGH',
    ]).optional(),

    assigneeId: z.string().uuid().optional().nullable(),

    project: z.string().trim().max(100).optional().nullable(),

    labels: z.array(z.string().trim().min(1).max(40)).max(20).optional(),

    dueDate: z.coerce.date().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        'At least one field is required',
    );
