
// src/App.tsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoList from './components/todos/TodoList';
import CategoryList from './components/categories/CategoryList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'todos' | 'categories'>('todos');

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          </div>
        </header>
        <main>
          <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('todos')}
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'todos' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'categories' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Categories
                </button>
              </div>
            </div>

            {activeTab === 'todos' ? <TodoList /> : <CategoryList />}
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;