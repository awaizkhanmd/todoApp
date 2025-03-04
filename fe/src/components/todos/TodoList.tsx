// src/components/todos/TodoList.tsx
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
  const [activeTab, setActiveTab] = useState<'today' | 'yesterday'>('today');

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

  // Filter todos based on tab selection (today/yesterday)
  const filterTodosByDate = (todos: ITodo[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (activeTab === 'today') {
      return todos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });
    } else {
      return todos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === yesterday.getTime();
      });
    }
  };

  const filteredTodos = filterTodosByDate(todos);
  const totalHours = filteredTodos.reduce((total, todo) => total + 2, 0); // Assuming 2 hours per todo for demo

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
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'yesterday' ? 'text-gray-800' : 'text-gray-500'}`}
            onClick={() => setActiveTab('yesterday')}
          >
            Yesterday
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === 'today' ? 'text-gray-800 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('today')}
          >
            Today
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
              <p className="text-gray-500">No todos for {activeTab}. Create a new one!</p>
            </div>
          ) : (
            <div>
              {filteredTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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