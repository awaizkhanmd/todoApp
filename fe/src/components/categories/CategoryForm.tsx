
// src/components/categories/CategoryForm.tsx
import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { addCategory, updateCategory } from '../../features/categories/categoriesSlice';
import { ICategory } from '../../types';

interface CategoryFormProps {
  category?: ICategory;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    if (category?.id) {
      dispatch(updateCategory({ id: category.id, name }));
    } else {
      dispatch(addCategory(name));
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${error ? 'border-red-300' : ''}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {category?.id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;