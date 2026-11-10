import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Check if the Authorization header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Not authenticated. Please log in.', 401);
  }

  // 2. Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using your secret
    const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };
    
    // 4. Attach the decoded user (which contains the ID) to req.user
    (req as any).user = decoded;
    
    // 5. Move to the next middleware/controller
    next();
  } catch (error) {
    // If token is invalid or expired
    return sendError(res, 'Invalid or expired token', 401);
  }
};