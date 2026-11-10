import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

const validate = (schema: ZodType) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.flatten(),
            });
        }

        req.body = result.data;

        next();
    };
};

export default validate;