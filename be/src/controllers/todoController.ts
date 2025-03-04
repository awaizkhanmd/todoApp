import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Todo, todos } from '../models/Todo';
import { categories } from '../models/Category';

// Get all todos with optional filtering and sorting
export const getAllTodos = (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const status = req.query.status as string;
    const sort = req.query.sort as string;
    const categoryId = req.query.categoryId as string;

    // Start with all todos
    let filteredTodos = [...todos];

    // Filter by status
    if (status) {
      if (status === 'active') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
      } else if (status === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
      }
    }

    // Filter by category
    if (categoryId) {
      filteredTodos = filteredTodos.filter(todo => todo.categoryId === categoryId);
    }

    // Sort todos
    if (sort) {
      if (sort === 'dueDate') {
        filteredTodos.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      } else if (sort === 'createdAt') {
        filteredTodos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    }

    res.json(filteredTodos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single todo
export const getTodoById = (req: Request, res: Response) => {
  try {
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new todo
export const createTodo = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, categoryId } = req.body;

    // Check if the category exists
    const categoryExists = categories.some(category => category.id === categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const todo = new Todo(
      title,
      description,
      new Date(dueDate),
      categoryId
    );

    todos.push(todo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a todo
export const updateTodo = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const todoIndex = todos.findIndex(t => t.id === req.params.id);
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const { title, description, dueDate, completed, categoryId } = req.body;

    // Check if the category exists when updating category
    if (categoryId) {
      const categoryExists = categories.some(category => category.id === categoryId);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    // Update the todo
    todos[todoIndex] = {
      ...todos[todoIndex],
      title: title || todos[todoIndex].title,
      description: description || todos[todoIndex].description,
      dueDate: dueDate ? new Date(dueDate) : todos[todoIndex].dueDate,
      completed: completed !== undefined ? completed : todos[todoIndex].completed,
      categoryId: categoryId || todos[todoIndex].categoryId,
      updatedAt: new Date()
    };

    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a todo
export const deleteTodo = (req: Request, res: Response) => {
  try {
    const todoIndex = todos.findIndex(t => t.id === req.params.id);
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};