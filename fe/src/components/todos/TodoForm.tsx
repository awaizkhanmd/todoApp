import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks';
import { ITodo } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

interface TodoFormProps {
  todo?: Partial<ITodo>;
  onSubmit: (todo: Partial<ITodo>) => void;
  onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel }) => {
  const categories = useAppSelector((state) => state.categories.categories);
  
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState(todo?.categoryId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (todo?.dueDate) {
      const date = new Date(todo.dueDate);
      setDueDate(date.toISOString().split('T')[0]);
    } else {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [todo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit({
      title,
      description,
      dueDate: new Date(dueDate),
      categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        fullWidth
      />
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      
      <Input
        label="Due Date"
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        error={errors.dueDate}
        fullWidth
      />
      
      <div className="mb-4">
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {todo?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
