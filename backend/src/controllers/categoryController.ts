import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Category, categories } from '../models/Category';
import { todos } from '../models/Todo';

// Get all categories
export const getAllCategories = (req: Request, res: Response) => {
  try {
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single category
export const getCategoryById = (req: Request, res: Response) => {
  try {
    const category = categories.find(c => c.id === req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new category
export const createCategory = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    // Check if category with the same name already exists
    const categoryExists = categories.some(category => category.name === name);
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = new Category(name);
    categories.push(category);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a category
export const updateCategory = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryIndex = categories.findIndex(c => c.id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name } = req.body;

    // Check if category with the same name already exists (excluding current category)
    const categoryExists = categories.some(category => 
      category.name === name && category.id !== req.params.id
    );
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    // Update the category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      updatedAt: new Date()
    };

    res.json(categories[categoryIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a category
export const deleteCategory = (req: Request, res: Response) => {
  try {
    const categoryIndex = categories.findIndex(c => c.id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if there are todos using this category
    const todosWithCategory = todos.some(todo => todo.categoryId === req.params.id);
    if (todosWithCategory) {
      return res.status(400).json({ 
        message: 'Cannot delete category because it has associated todos. Please reassign or delete these todos first.' 
      });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all todos in a category
export const getTodosByCategory = (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    
    // Check if the category exists
    const categoryExists = categories.some(category => category.id === categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const todosInCategory = todos.filter(todo => todo.categoryId === categoryId);
    res.json(todosInCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};