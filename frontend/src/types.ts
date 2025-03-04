// src/types.ts
export interface ITodo {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  completed: boolean;
  categoryId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICategory {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}