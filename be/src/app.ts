import express from 'express';
import { json, urlencoded } from 'express';
import todoRoutes from './routes/todoRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { errorHandler, notFound, corsMiddleware } from './middleware/errorMiddleware';

// Initialize Express app
const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
//app.use(corsMiddleware);

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
