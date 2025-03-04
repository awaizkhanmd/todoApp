import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateTodo, deleteTodo } from '../../features/todos/todosSlice';
import { ITodo } from '../../types';
import Button from '../common/Button';
import TodoForm from './TodoForm';
import Modal from '../common/Modal';

interface TodoItemProps {
  todo: ITodo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const category = categories.find((cat) => cat.id === todo.categoryId);

  const handleToggleComplete = () => {
    dispatch(updateTodo({ id: todo.id, todoData: { completed: !todo.completed } }));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
    setDeleteModalOpen(false);
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determine if the todo is overdue
  const isOverdue = () => {
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    return !todo.completed && dueDate < today;
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${todo.completed ? 'bg-gray-50' : ''} ${isOverdue() ? 'border-red-300' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
          />
          <div className="ml-3">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
            <p className="text-sm text-gray-600">{todo.description}</p>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${isOverdue() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                Due: {formatDate(todo.dueDate)}
              </span>
              {category && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {category.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => setEditModalOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Todo">
        <TodoForm
          todo={todo}
          onSubmit={(updatedTodo) => {
            dispatch(updateTodo({ id: todo.id, todoData: updatedTodo }));
            setEditModalOpen(false);
          }}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this todo item?</p>
      </Modal>
    </div>
  );
};

export default TodoItem;