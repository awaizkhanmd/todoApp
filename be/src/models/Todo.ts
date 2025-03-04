
import { v4 as uuidv4 } from 'uuid';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo implements ITodo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    title: string,
    description: string,
    dueDate: Date,
    categoryId: string,
    completed: boolean = false,
    id: string = uuidv4(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = completed;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// In-memory database for todos
export const todos: Todo[] = [];