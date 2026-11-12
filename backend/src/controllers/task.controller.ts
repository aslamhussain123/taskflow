import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';

// CREATE
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const task = await taskService.createTask(userId, req.body);
  return sendSuccess(res, task, 'Task created successfully', 201);
});

// READ ALL
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tasks = await taskService.getAllTasks(userId, req.query);
  return sendSuccess(res, tasks, 'Tasks fetched successfully', 200);
});

export const getAssignees = asyncHandler(async (_req: Request, res: Response) => {
  const users = await taskService.getAssignees();
  return sendSuccess(res, users, 'Assignees fetched successfully', 200);
});

// READ ONE
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const task = await taskService.getTaskById(userId, req.params.id as string);

  if (!task) {
    return sendError(res, 'Task not found', 404);
  }

  return sendSuccess(res, task, 'Task fetched successfully', 200);
});

// UPDATE
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const task = await taskService.updateTask(userId, req.params.id as string, req.body);
  return sendSuccess(res, task, 'Task updated successfully', 200);
});

// DELETE
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await taskService.deleteTask(userId, req.params.id as string);
  return sendSuccess(res, null, 'Task deleted successfully', 200);
});

// STATS
export const getTaskStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const stats = await taskService.getTaskStats(userId);
  return sendSuccess(res, stats, 'Task statistics fetched successfully', 200);
});
