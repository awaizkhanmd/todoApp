// src/components/categories/CategoryList.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchCategories, deleteCategory } from '../../features/categories/categoriesSlice';
import CategoryForm from './CategoryForm';
import Modal from '../common/Modal';
import { ICategory } from '../../types';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector((state) => state.categories);
  const todos = useAppSelector((state) => state.todos.todos);
  
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDeleteCategory = (categoryId: string) => {
    // Check if there are todos using this category
    const hasTodos = todos.some((todo) => todo.categoryId === categoryId);
    
    if (hasTodos) {
      setErrorMessage('Cannot delete this category because it has associated todos. Please reassign or delete these todos first.');
      return;
    }
    
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete));
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const getCategoryTodoCount = (categoryId: string) => {
    return todos.filter((todo) => todo.categoryId === categoryId).length;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button 
          onClick={() => setNewCategoryModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Category
        </button>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600">No categories found. Create a new one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => {
            const todoCount = getCategoryTodoCount(category.id);
            const bgColor = todoCount === 0 ? 'bg-gray-100' : (todoCount % 2 === 0 ? 'bg-green-100' : 'bg-pink-100');
            
            return (
              <div 
                key={category.id} 
                className={`${bgColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600">{todoCount} todos</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Category Modal */}
      <Modal
        isOpen={newCategoryModalOpen}
        onClose={() => setNewCategoryModalOpen(false)}
        title="Add New Category"
      >
        <CategoryForm
          onSubmit={() => setNewCategoryModalOpen(false)}
          onCancel={() => setNewCategoryModalOpen(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onSubmit={() => setEditingCategory(null)}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <button 
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        title="Error"
        footer={
          <button 
            onClick={() => setErrorMessage(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        }
      >
        <p className="text-red-600">{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default CategoryList;
