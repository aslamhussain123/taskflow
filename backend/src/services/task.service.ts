import prisma from '../config/database';

export const createTask = async (userId: string, data: any) => {
    if (data.assigneeId) {
        const assignee = await prisma.user.findUnique({ where: { id: data.assigneeId }, select: { id: true } });
        if (!assignee) throw new Error('Assignee not found');
    }
    return await prisma.task.create({
        data: {
            ...data,
            status: data.status ?? 'BACKLOG',
            labels: JSON.stringify(data.labels ?? []),
            userId, // Attach the task to the logged-in user
        },
    });
};

export const getAllTasks = async (userId: string, query: any) => {
    const { status, priority } = query;
    return await prisma.task.findMany({
        where: {
            OR: [{ userId }, { assigneeId: userId }],
            status: status || undefined,
            priority: priority || undefined,
        },
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const getAssignees = async () => prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
});

export const getTaskById = async (userId: string, id: string) => {
    return await prisma.task.findFirst({
        where: { id, OR: [{ userId }, { assigneeId: userId }] },
        include: { assignee: { select: { id: true, name: true } } },
    });
};

export const updateTask = async (userId: string, id: string, data: any) => {
    const existing = await prisma.task.findFirst({ where: { id, OR: [{ userId }, { assigneeId: userId }] } });
    if (!existing) throw new Error('Task not found or unauthorized');

    if (data.assigneeId) {
        const assignee = await prisma.user.findUnique({ where: { id: data.assigneeId }, select: { id: true } });
        if (!assignee) throw new Error('Assignee not found');
    }

    return await prisma.task.update({
        where: { id },
        data: {
            ...data,
            labels: data.labels === undefined ? undefined : JSON.stringify(data.labels),
            dueDate: data.dueDate === undefined
                ? undefined
                : data.dueDate === null
                    ? null
                    : new Date(data.dueDate),
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
            status: { notIn: ['DONE', 'CANCELED'] },
            dueDate: { lt: new Date() },
        },
    });

    return { total, completed, inProgress, overdue };
};
