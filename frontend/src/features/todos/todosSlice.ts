import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { todoService } from '../../services/todoService';
import { ITodo } from '../../types';

interface TodosState {
  todos: ITodo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activeFilter: string;
  activeSort: string;
  activeCategoryId: string | null;
}

const initialState: TodosState = {
  todos: [],
  status: 'idle',
  error: null,
  activeFilter: 'all',
  activeSort: 'dueDate',
  activeCategoryId: null,
};

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (filters: { status?: string; sort?: string; categoryId?: string } = {}, { rejectWithValue }) => {
    try {
      return await todoService.getAllTodos(filters);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData: Omit<ITodo, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await todoService.createTodo(todoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todoData }: { id: string; todoData: Partial<ITodo> }, { rejectWithValue }) => {
    try {
      return await todoService.updateTodo(id, todoData);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue }) => {
    try {
      const deletedTodo = await todoService.deleteTodo(id);
      return { id, deletedTodo };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create slice
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.activeSort = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.activeCategoryId = action.payload;
    },
    clearFilters: (state) => {
      state.activeFilter = 'all';
      state.activeSort = 'dueDate';
      state.activeCategoryId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
      });
  },
});

export const { setFilter, setSort, setCategoryFilter, clearFilters } = todosSlice.actions;

export default todosSlice.reducer;
