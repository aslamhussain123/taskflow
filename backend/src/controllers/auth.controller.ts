import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/apiResponse';

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    return sendSuccess(res, user, 'User registered successfully', 201);
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return sendSuccess(res, data, 'Login successful');
  } catch (error: any) {
    return sendError(res, error.message, 401);
  }
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, 'Refresh token required', 401);
  
  try {
    const tokens = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, tokens, 'Token refreshed');
  } catch (error) {
    return sendError(res, 'Invalid refresh token', 401);
  }
});