import express from 'express';
import { body } from 'express-validator';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoController';

const router = express.Router();

// GET /api/todos - Get all todos
router.get('/', getAllTodos);

// GET /api/todos/:id - Get a single todo by ID
router.get('/:id', getTodoById as express.RequestHandler);

// POST /api/todos - Create a new todo
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
    body('categoryId').notEmpty().withMessage('Category ID is required')
  ],
  createTodo as express.RequestHandler
);

// PUT /api/todos/:id - Update a todo
router.put(
  '/:id',
  [
    body('title').optional(),
    body('description').optional(),
    body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
    body('completed').optional().isBoolean().withMessage('Completed status must be a boolean'),
    body('categoryId').optional()
  ],
  updateTodo as express.RequestHandler
);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', deleteTodo as express.RequestHandler);

export default router;