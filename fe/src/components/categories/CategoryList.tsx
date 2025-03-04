import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchCategories, deleteCategory } from '../../features/categories/categoriesSlice';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector((state) => state.categories);
  const todos = useAppSelector((state) => state.todos.todos);
  
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Check if there are todos using this category
      const hasTodos = todos.some((todo) => todo.categoryId === categoryId);
      
      if (hasTodos) {
        setErrorMessage('Cannot delete this category because it has associated todos. Please reassign or delete these todos first.');
        return;
      }
      
      await dispatch(deleteCategory(categoryId));
      setDeletingCategory(null);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const getCategoryTodoCount = (categoryId: string) => {
    return todos.filter((todo) => todo.categoryId === categoryId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setNewCategoryModalOpen(true)}>Add New Category</Button>
      </div>

      {status === 'loading' && <p className="text-center py-4">Loading...</p>}
      
      {status === 'failed' && <p className="text-center text-red-600 py-4">Error: {error}</p>}

      {status === 'succeeded' && (
        <>
          {categories.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border rounded-lg">
              <p className="text-gray-600">No categories found. Create a new one!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Todo Count
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{getCategoryTodoCount(category.id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => setEditCategory(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setDeletingCategory(category.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
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
        isOpen={!!editCategory}
        onClose={() => setEditCategory(null)}
        title="Edit Category"
      >
        {editCategory && (
          <CategoryForm
            category={{ ...editCategory, createdAt: '', updatedAt: '' }}
            onSubmit={() => setEditCategory(null)}
            onCancel={() => setEditCategory(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Confirm Delete"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deletingCategory && handleDeleteCategory(deletingCategory)}
            >
              Delete
            </Button>
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
          <Button onClick={() => setErrorMessage(null)}>Close</Button>
        }
      >
        <p className="text-red-600">{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default CategoryList;