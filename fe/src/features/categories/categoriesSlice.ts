// src/features/categories/categoriesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';
import { ICategory } from '../../types';

interface CategoriesState {
  categories: ICategory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAllCategories();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (name: string, { rejectWithValue }) => {
    try {
      return await categoryService.createCategory(name);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory(id, name);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const deletedCategory = await categoryService.deleteCategory(id);
      return { id, deletedCategory };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((category) => category.id !== action.payload.id);
      });
  },
});

export default categoriesSlice.reducer;