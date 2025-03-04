import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchTodos } from '../../features/todos/todosSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import TodoItem from './TodoItem';
import TodoFilter from './TodoFilter';
import TodoForm from './TodoForm';
import Button from '../common/Button';
import Modal from '../common/Modal';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, status, error, activeFilter, activeSort, activeCategoryId } = useAppSelector(
    (state) => state.todos
  );
  const categoriesStatus = useAppSelector((state) => state.categories.status);
  const [newTodoModalOpen, setNewTodoModalOpen] = useState(false);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    const filters: { status?: string; sort?: string; categoryId?: string } = {};
    
    if (activeFilter !== 'all') {
      filters.status = activeFilter;
    }
    
    if (activeSort) {
      filters.sort = activeSort;
    }
    
    if (activeCategoryId) {
      filters.categoryId = activeCategoryId;
    }
    
    dispatch(fetchTodos(filters));
  }, [dispatch, activeFilter, activeSort, activeCategoryId]);

  const groupTodosByCategory = () => {
    const grouped: Record<string, typeof todos> = {};
    const categories = useAppSelector((state) => state.categories.categories);
    
    // Initialize groups with all categories
    categories.forEach((category) => {
      grouped[category.id] = [];
    });
    
    // Group todos by category
    todos.forEach((todo) => {
      if (grouped[todo.categoryId]) {
        grouped[todo.categoryId].push(todo);
      }
    });
    
    return grouped;
  };

  const groupedTodos = groupTodosByCategory();
  const categories = useAppSelector((state) => state.categories.categories);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <Button onClick={() => setNewTodoModalOpen(true)}>Add New Todo</Button>
      </div>

      <TodoFilter />

      {status === 'loading' && <p className="text-center py-4">Loading...</p>}
      
      {status === 'failed' && <p className="text-center text-red-600 py-4">Error: {error}</p>}

      {status === 'succeeded' && (
        <>
          {todos.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 border rounded-lg">
              <p className="text-gray-600">No todos found. Create a new one!</p>
            </div>
          ) : activeCategoryId ? (
            // Show todos for a specific category
            <div>
              {groupedTodos[activeCategoryId]?.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          ) : (
            // Show all todos grouped by category
            <>
              {categories.map((category) => {
                const categoryTodos = groupedTodos[category.id] || [];
                if (categoryTodos.length === 0) return null;
                
                return (
                  <div key={category.id} className="mb-8">
                    <h2 className="text-xl font-semibold mb-3 pb-2 border-b">
                      {category.name}
                    </h2>
                    {categoryTodos.map((todo) => (
                      <TodoItem key={todo.id} todo={todo} />
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </>
      )}

      {/* New Todo Modal */}
      <Modal
        isOpen={newTodoModalOpen}
        onClose={() => setNewTodoModalOpen(false)}
        title="Add New Todo"
      >
        <TodoForm
          onSubmit={(todoData) => {
            dispatch(fetchTodos({
              status: activeFilter !== 'all' ? activeFilter : undefined,
              sort: activeSort,
              categoryId: activeCategoryId || undefined
            }));
            setNewTodoModalOpen(false);
          }}
          onCancel={() => setNewTodoModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TodoList;