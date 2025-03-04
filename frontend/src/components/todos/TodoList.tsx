// src/components/todos/TodoList.tsx
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../../features/todos/todosSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import TodoItem from './TodoItem';
import TodoFilter from './TodoFilter';
import TodoForm from './TodoForm';
import Modal from '../common/Modal';
import { ITodo } from '../../types';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, status, error, activeFilter, activeSort, activeCategoryId } = useAppSelector(
    (state) => state.todos
  );
  const { categories } = useAppSelector((state) => state.categories);
  const [newTodoModalOpen, setNewTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'previous' | 'upcoming'>('today');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

  const handleToggleComplete = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      dispatch(updateTodo({ 
        id, 
        todoData: { completed: !todo.completed } 
      }));
    }
  };

  const handleEdit = (todo: ITodo) => {
    setEditingTodo(todo);
  };

  const handleDelete = (id: string) => {
    setTodoToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      dispatch(deleteTodo(todoToDelete));
      setDeleteConfirmOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleSubmit = (todoData: Partial<ITodo>) => {
    if (editingTodo) {
      dispatch(updateTodo({ id: editingTodo.id, todoData }));
      setEditingTodo(null);
    } else {
      dispatch(addTodo(todoData as Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>));
      setNewTodoModalOpen(false);
    }
  };

  // Filter todos based on tab selection
  const filterTodosByTab = (todos: ITodo[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (activeTab === 'today') {
        return dueDate.getTime() === today.getTime();
      } else if (activeTab === 'previous') {
        return dueDate.getTime() < today.getTime();
      } else { // upcoming
        return dueDate.getTime() > today.getTime();
      }
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const filteredTodos = filterTodosByTab(todos);
  const totalHours = filteredTodos.reduce((total, todo) => total + 2, 0); // Assuming 2 hours per todo

  // Organize todos by category for group display
  const todosByCategory = filteredTodos.reduce((acc: Record<string, ITodo[]>, todo) => {
    const categoryId = todo.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(todo);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button 
          onClick={() => setNewTodoModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center"
          aria-label="Add new todo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Todo
        </button>
      </div>

      <div className="flex mb-6 md:flex-row flex-col md:space-x-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 md:mb-0 md:flex-1">
          <div className="flex border-b">
            <button 
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'previous' ? 'text-gray-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('previous')}
            >
              Previous
            </button>
            <button 
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'today' ? 'text-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('today')}
            >
              Today
            </button>
            <button 
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'upcoming' ? 'text-gray-800' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
          </div>
          
          <div className="p-4">
            <div className="mb-4 text-gray-500">
              {totalHours}:00h
            </div>

            {status === 'loading' ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No {activeTab} todos found. Create a new one!</p>
              </div>
            ) : (
              <div>
                {filteredTodos.map(todo => (
                  <div key={todo.id} className={`rounded-xl p-4 mb-3 ${todo.completed ? 'bg-gray-100' : 'bg-blue-50'} hover:shadow-md transition-all`}>
                    <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={todo.completed} 
                        onChange={() => handleToggleComplete(todo.id)}
                        className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300 mr-3"
                      />
                      <div className="flex-grow">
                        <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
                        
                        <div className="mt-2 flex items-center text-sm">
                          <span className="text-gray-500">
                            2:00h
                            {new Date(todo.dueDate).toDateString() === new Date().toDateString() && 
                              <span className="ml-2 text-red-500">| Due today</span>
                            }
                          </span>
                          <span className="ml-4 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                            {getCategoryName(todo.categoryId)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(todo)}
                          className="text-blue-500 hover:text-blue-700"
                          aria-label="Edit todo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(todo.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete todo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <TodoFilter />
        </div>
      </div>

      {/* New Todo Modal */}
      <Modal
        isOpen={newTodoModalOpen}
        onClose={() => setNewTodoModalOpen(false)}
        title="Add New Todo"
      >
        <TodoForm
          onSubmit={handleSubmit}
          onCancel={() => setNewTodoModalOpen(false)}
        />
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        title="Edit Todo"
      >
        {editingTodo && (
          <TodoForm
            todo={editingTodo}
            onSubmit={handleSubmit}
            onCancel={() => setEditingTodo(null)}
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
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2 hover:bg-gray-300"
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
        <p>Are you sure you want to delete this todo?</p>
      </Modal>
    </div>
  );
};

export default TodoList;