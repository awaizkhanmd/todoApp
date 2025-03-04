// src/components/todos/TodoItem.tsx
import React from 'react';
import { ITodo } from '../../types';

interface TodoItemProps {
  todo: ITodo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: ITodo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  // Format duration as hours (e.g., "2:30h")
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}h`;
  };

  // Determine if todo is due today
  const isToday = (date: Date | string) => {
    const todoDate = new Date(date);
    const today = new Date();
    return todoDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  // Get appropriate background color based on status and due date
  const getBgColor = () => {
    if (todo.completed) return 'bg-gray-100';
    if (new Date(todo.dueDate) < new Date()) return 'bg-red-200'; // Overdue
    if (isToday(todo.dueDate)) return 'bg-yellow-200'; // Due today
    return 'bg-blue-100'; // Normal
  };

  return (
    <div className={`rounded-xl p-4 mb-3 ${getBgColor()} transition-all hover:shadow-md`}>
      <div className="flex items-start">
        <div className="flex-grow">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => onToggleComplete(todo.id)}
              className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3"
            />
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </h3>
          </div>
          <p className="text-gray-600 mt-1">{todo.description}</p>
          
          <div className="mt-2 flex items-center">
            <span className="text-sm text-gray-500">
              {formatDuration(120)} {/* Assuming 120 minutes (2 hours) - replace with actual todo duration */}
              {isToday(todo.dueDate) && <span className="ml-2 text-red-500">| Due today</span>}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(todo)}
            className="text-blue-500 hover:text-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;