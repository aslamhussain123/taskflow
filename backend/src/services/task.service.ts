import prisma from '../config/database';

export const createTask = async (userId: string, data: any) => {
    return await prisma.task.create({
        data: {
            ...data,
            userId, // Attach the task to the logged-in user
        },
    });
};

export const getAllTasks = async (userId: string, query: any) => {
    const { status, priority } = query;
    return await prisma.task.findMany({
        where: {
            userId,
            status: status || undefined,
            priority: priority || undefined,
        },
        orderBy: { createdAt: 'desc' },
    });
};

export const getTaskById = async (userId: string, id: string) => {
    return await prisma.task.findFirst({
        where: { id, userId }, // Ensure the task belongs to this user
    });
};

export const updateTask = async (userId: string, id: string, data: any) => {
    // Verify ownership first
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new Error('Task not found or unauthorized');

    return await prisma.task.update({
        where: { id },
        data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
    });
};

export const deleteTask = async (userId: string, id: string) => {
    // Verify ownership first
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) throw new Error('Task not found or unauthorized');

    return await prisma.task.delete({ where: { id } });
};

export const getTaskStats = async (userId: string) => {
    const total = await prisma.task.count({ where: { userId } });
    const completed = await prisma.task.count({ where: { userId, status: 'DONE' } });
    const inProgress = await prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } });
    const overdue = await prisma.task.count({
        where: {
            userId,
            status: { not: 'DONE' },
            dueDate: { lt: new Date() },
        },
    });

    return { total, completed, inProgress, overdue };
};