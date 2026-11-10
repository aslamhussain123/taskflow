"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const database_1 = __importDefault(require("../config/database"));
const createTask = async (data) => {
    return database_1.default.task.create({
        data,
    });
};
exports.createTask = createTask;
const getAllTasks = async () => {
    return database_1.default.task.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (id) => {
    return database_1.default.task.findUnique({
        where: { id },
    });
};
exports.getTaskById = getTaskById;
const updateTask = async (id, data) => {
    return database_1.default.task.update({
        where: { id },
        data,
    });
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    return database_1.default.task.delete({
        where: { id },
    });
};
exports.deleteTask = deleteTask;
const getTaskStats = async () => {
    const [total, todo, inProgress, completed] = await Promise.all([
        database_1.default.task.count(),
        database_1.default.task.count({ where: { status: 'TODO' } }),
        database_1.default.task.count({ where: { status: 'IN_PROGRESS' } }),
        database_1.default.task.count({ where: { status: 'COMPLETED' } }),
    ]);
    return {
        total,
        todo,
        inProgress,
        completed,
    };
};
exports.getTaskStats = getTaskStats;
