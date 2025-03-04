import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { addCategory, updateCategory } from '../../features/categories/categoriesSlice';
import { ICategory } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

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
    <form onSubmit={handleSubmit}>
      <Input
        label="Category Name"
        id="categoryName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        fullWidth
      />
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {category?.id ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;