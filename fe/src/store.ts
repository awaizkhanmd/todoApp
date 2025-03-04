import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';
import categoriesReducer from './features/categories/categoriesSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;