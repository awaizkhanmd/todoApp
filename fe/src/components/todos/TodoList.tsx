// src/components/todos/TodoList.tsx - Updated filtering logic
import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../../features/todos/todosSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
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
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');

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

  // Improved filtering logic for todos
  const filterTodosByTab = (todos: ITodo[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (activeTab === 'today') {
      // Today tab shows:
      // 1. Todos due today
      // 2. Overdue todos (due before today)
      return todos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() <= today.getTime();
      });
    } else {
      // Upcoming tab shows future todos
      return todos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() > today.getTime();
      });
    }
  };

  const filteredTodos = filterTodosByTab(todos);
  const totalHours = filteredTodos.length * 2; // Assuming 2 hours per todo

  // Function to check if a todo is due today
  const isDueToday = (dueDate: string | Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todoDate = new Date(dueDate);
    todoDate.setHours(0, 0, 0, 0);
    
    return todoDate.getTime() === today.getTime();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        <button 
          onClick={() => setNewTodoModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Todo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="flex border-b">
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'today' ? 'text-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('today')}
          >
            Today
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'upcoming' ? 'text-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}`}
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
              <p className="text-gray-500">No {activeTab === 'today' ? 'current' : 'upcoming'} todos. Create a new one!</p>
            </div>
          ) : (
            <div>
              {filteredTodos.map(todo => (
                <div key={todo.id} className={`bg-gray-100 rounded-lg p-4 mb-3 ${todo.completed ? 'opacity-70' : ''}`}>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="mt-1 h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="ml-3 flex-grow">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.title}
                      </h3>
                      <p className="text-sm text-gray-600">{todo.description}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">2:00h</span>
                        {isDueToday(todo.dueDate) && 
                          <span className="ml-2 text-xs text-red-500">| Due today</span>
                        }
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(todo)} className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(todo.id)} className="text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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

      <TodoFilter />

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