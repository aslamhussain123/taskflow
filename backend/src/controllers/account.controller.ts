import { Request, Response } from 'express';
import * as accountService from '../services/account.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendError, sendSuccess } from '../utils/apiResponse';

const authenticatedUserId = (req: Request) => (req as any).user.id as string;

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const account = await accountService.getAccountSettings(authenticatedUserId(req));
  return sendSuccess(res, account, 'Settings fetched');
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const { name, emailTaskDue, weeklyReport, theme } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return sendError(res, 'Name must be at least 2 characters', 400);
  }
  if (emailTaskDue !== undefined && typeof emailTaskDue !== 'boolean') {
    return sendError(res, 'emailTaskDue must be a boolean', 400);
  }
  if (weeklyReport !== undefined && typeof weeklyReport !== 'boolean') {
    return sendError(res, 'weeklyReport must be a boolean', 400);
  }
  if (theme !== undefined && !['system', 'light', 'dark'].includes(theme)) {
    return sendError(res, 'Invalid theme', 400);
  }

  const account = await accountService.updateAccountSettings(authenticatedUserId(req), {
    ...(name === undefined ? {} : { name: name.trim() }),
    ...(emailTaskDue === undefined ? {} : { emailTaskDue }),
    ...(weeklyReport === undefined ? {} : { weeklyReport }),
    ...(theme === undefined ? {} : { theme }),
  });
  return sendSuccess(res, account, 'Settings saved');
});

export const getTickets = asyncHandler(async (req: Request, res: Response) => {
  const tickets = await accountService.getSupportTickets(authenticatedUserId(req));
  return sendSuccess(res, tickets, 'Support requests fetched');
});

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const subject = typeof req.body.subject === 'string' ? req.body.subject.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 5000) {
    return sendError(res, 'Enter a subject (3-120 characters) and message (10-5000 characters)', 400);
  }

  const ticket = await accountService.createSupportTicket(authenticatedUserId(req), subject, message);
  return sendSuccess(res, ticket, 'Support request submitted', 201);
});
