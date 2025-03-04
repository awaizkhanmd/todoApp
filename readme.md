This is sample how the application is gonna like
[https://todo-fe-nume.onrender.com/](https://todo-fe-nume.onrender.com/)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Git

## Quick Start

Use these commands to get the application running with a single command:

```bash
# Clone the repository
git clone https://github.com/awaizkhanmd/todoApp.git


After Cloning the Repository open the  Frontend Folder

```bash


# Install frontend dependencies
cd frontend
npm install all
npm run dev
cd ..

# Install backend dependencies
cd backend
npm install
npm run dev
cd ..


Starts both the frontend and backend applications in development mode.
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

### `npm run frontend`

Starts only the frontend application in development mode.

### `npm run backend`

Starts only the backend application in development mode.

### `npm run build`

Builds both the frontend and backend applications for production.

### `npm run start`



## API Endpoints

### Todo Endpoints

- `GET /api/todos` - Get all todos (with optional filtering)
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
