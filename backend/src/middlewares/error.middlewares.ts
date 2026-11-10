import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' || !(error instanceof Error)
      ? 'Internal server error'
      : error.message,
  });
};

export default errorMiddleware;
