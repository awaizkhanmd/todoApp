import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import TodoList from './components/todos/TodoList';
import CategoryList from './components/categories/CategoryList';
import Button from './components/common/Button';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'todos' | 'categories'>('todos');

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
          </div>
        </header>
        <main>
          <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex space-x-4">
              <Button
                onClick={() => setActiveTab('todos')}
                variant={activeTab === 'todos' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                Todos
              </Button>
              <Button
                onClick={() => setActiveTab('categories')}
                variant={activeTab === 'categories' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                Categories
              </Button>
            </div>

            {activeTab === 'todos' ? <TodoList /> : <CategoryList />}
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;