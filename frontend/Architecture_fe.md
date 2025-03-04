# Todo App Frontend

A modern Todo application built with React, Redux Toolkit, TypeScript, and Tailwind CSS.

## Features

- Create, read, update, and delete todo items
- Assign categories to todo items
- Mark todos as complete/incomplete
- Filter todos by completion status
- Sort todos by due date or creation date
- Group todos by time (Today, Previous, Upcoming)
- Create and manage categories
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see Backend README)

### Installation

1. Create a new Vite project:
```bash
# Using npm
npm create vite@latest todo-app-frontend -- --template react-ts

# Using yarn
yarn create vite todo-app-frontend --template react-ts
```

2. Navigate to the frontend directory:
```bash
cd todo-app-frontend
```

3. Install dependencies:
```bash
npm install @reduxjs/toolkit react-redux
npm install -D tailwindcss autoprefixer postcss
```

4. Set up Tailwind CSS:
```bash
npx tailwindcss init -p
```

5. Configure Tailwind CSS - update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

6. Add Tailwind directives to your CSS - update `src/index.css`:
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Custom styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f3f4f6;
}
```

7. Create the following project structure:
```
todo-app-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   ├── todos/
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── TodoFilter.tsx
│   │   └── categories/
│   │       ├── CategoryList.tsx
│   │       └── CategoryForm.tsx
│   ├── features/
│   │   ├── todos/
│   │   │   └── todosSlice.ts
│   │   └── categories/
│   │       └── categoriesSlice.ts
│   ├── services/
│   │   ├── todoService.ts
│   │   └── categoryService.ts
│   ├── types.ts
│   ├── hooks.ts
│   ├── store.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

8. Update the API URL in your service files to point to your backend:
```typescript
// src/services/todoService.ts and src/services/categoryService.ts
const API_URL = 'http://localhost:5000/api';
```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

## Application Structure

### Core Components

- **App**: Main application component with tab navigation
- **TodoList**: Displays todo items with filtering and sorting
- **TodoForm**: Form for creating and editing todos
- **TodoFilter**: Filter and sort controls for todos
- **CategoryList**: Displays and manages categories
- **CategoryForm**: Form for creating and editing categories
- **Modal**: Reusable modal component for forms and confirmations

### State Management

The application uses Redux Toolkit for state management with the following slices:

- **todosSlice**: Manages todos state and provides actions for CRUD operations
- **categoriesSlice**: Manages categories state and provides actions for CRUD operations

### Services

- **todoService**: Handles API communication for todo operations
- **categoryService**: Handles API communication for category operations

## Customizing the UI

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the theme in `tailwind.config.js`
2. Adding custom styles in `src/index.css`
3. Updating the component classes directly