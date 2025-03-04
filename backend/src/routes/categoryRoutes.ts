import express from 'express';
import { body } from 'express-validator';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getTodosByCategory
} from '../controllers/categoryController';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById as express.RequestHandler);
router.get('/:id/todos', getTodosByCategory as express.RequestHandler);
router.post(
  '/',
  [body('name').notEmpty().withMessage('Category name is required')],
  createCategory as express.RequestHandler
);
router.put(
  '/:id',
  [body('name').notEmpty().withMessage('Category name is required')],
  updateCategory as express.RequestHandler
);
router.delete('/:id', deleteCategory as express.RequestHandler);

export default router;