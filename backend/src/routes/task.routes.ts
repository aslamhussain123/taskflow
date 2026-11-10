import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';
import validate from '../middlewares/validate.middlewares';
import { requireAuth } from '../middlewares/auth.middleware'; // Now this exists!

const router = Router();

// Protect ALL routes below this line
router.use(requireAuth);

// Dashboard statistics
router.get('/stats', taskController.getTaskStats);

// Get all tasks
router.get('/get-all', taskController.getAllTasks);

// Get single task
router.get('/single/:id', taskController.getTaskById);

// Create task
router.post(
    '/create',
    validate(createTaskSchema),
    taskController.createTask,
);

// Update task
router.patch(
    '/update/:id',
    validate(updateTaskSchema),
    taskController.updateTask,
);

// Delete task
router.delete('/delete/:id', taskController.deleteTask);

export default router;