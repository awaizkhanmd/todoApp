// src/services/categoryService.ts
import { ICategory } from '../types';

const API_URL = 'http://localhost:5000/api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get a single category by ID
  getCategoryById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (name: string) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update a category
  updateCategory: async (id: string, name: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Get todos by category ID
  getTodosByCategory: async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos by category');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching todos for category ${categoryId}:`, error);
      throw error;
    }
  },
};