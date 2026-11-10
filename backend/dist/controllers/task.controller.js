"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskStats = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const taskService = __importStar(require("../services/task.service"));
const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json({
            success: true,
            message: 'Tasks fetched successfully',
            data: tasks,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res, next) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            res.status(404).json({
                success: false,
                message: 'Task not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const getTaskStats = async (req, res, next) => {
    try {
        const stats = await taskService.getTaskStats();
        res.status(200).json({
            success: true,
            message: 'Task statistics fetched successfully',
            data: stats,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskStats = getTaskStats;
