import { ITodo } from '../types';

const API_URL = 'http://localhost:5000/api';

export const todoService = {
  // Get all todos
  getAllTodos: async (filters?: { status?: string; sort?: string; categoryId?: string }) => {
    try {
      // Build query string
      let queryString = '';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        queryString = `?${params.toString()}`;
      }

      const response = await fetch(`${API_URL}/todos${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get a single todo by ID
  getTodoById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch todo');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData: Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create todo');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id: string, todoData: Partial<ITodo>) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update todo');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  },
};
