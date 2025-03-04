# Todo App Backend

A RESTful API for managing todos and categories built with Node.js, Express.js, and TypeScript.

## Features

- CRUD operations for todos
- CRUD operations for categories 
- Filter todos by completion status
- Sort todos by due date or creation date
- Group todos by categories
- In-memory database for easy testing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or create a new directory for the backend

2. Navigate to the backend directory:
```bash
cd todo-app-backend
```

3. Create a package.json file:
```bash
npm init -y
```

4. Install dependencies:
```bash
npm install express express-validator uuid
npm install --save-dev typescript ts-node nodemon @types/express @types/node @types/uuid
```

5. Set up TypeScript configuration by creating a `tsconfig.json` file:
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

6. Update your package.json scripts:
```json
"scripts": {
  "start": "node dist/server.js",
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc"
}
```

7. Create your project structure:
```
todo-app-backend/
├── src/
│   ├── controllers/
│   │   ├── todoController.ts
│   │   └── categoryController.ts
│   ├── models/
│   │   ├── Todo.ts
│   │   └── Category.ts
│   ├── routes/
│   │   ├── todoRoutes.ts
│   │   └── categoryRoutes.ts
│   ├── middleware/
│   │   └── errorMiddleware.ts
│   ├── app.ts
│   └── server.ts
└── tsconfig.json
```

### Running the Server

To start the development server with hot-reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

To build for production:

```bash
npm run build
npm start
```

## API Endpoints

### Todo Endpoints

- `GET /api/todos` - Get all todos (with optional filtering)
  - Query parameters:
    - `status`: Filter by completion status (`all`, `active`, `completed`)
    - `sort`: Sort the todos (`dueDate`, `createdAt`)
    - `categoryId`: Filter by category ID

- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Category Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a single category
- `GET /api/categories/:id/todos` - Get all todos in a category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

## Data Models

### Todo

```typescript
interface ITodo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
interface ICategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Note

This backend uses an in-memory database for simplicity. 