import { v4 as uuidv4 } from 'uuid';

export interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Category implements ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    name: string,
    id: string = uuidv4(),
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// In-memory database for categories
export const categories: Category[] = [];

// Add some default categories
categories.push(new Category("Personal"));
categories.push(new Category("Work"));
categories.push(new Category("Shopping"));