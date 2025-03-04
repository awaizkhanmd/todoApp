// src/components/todos/TodoFilter.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setFilter, setSort, setCategoryFilter } from '../../features/todos/todosSlice';

const TodoFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeFilter, activeSort, activeCategoryId } = useAppSelector((state) => state.todos);
  const categories = useAppSelector((state) => state.categories.categories);

  return (
    <div className="bg-white p-4 mb-6 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status filter */}
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="statusFilter"
            value={activeFilter}
            onChange={(e) => dispatch(setFilter(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort filter */}
        <div>
          <label htmlFor="sortFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortFilter"
            value={activeSort}
            onChange={(e) => dispatch(setSort(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Creation Date</option>
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="categoryFilter"
            value={activeCategoryId || ''}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value || null))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;
