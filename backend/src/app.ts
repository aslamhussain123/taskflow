import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.route';
import express from 'express';
import cors from 'cors';

import taskRoutes from './routes/task.routes';
import accountRoutes from './routes/account.routes';
import errorMiddleware from './middlewares/error.middlewares';

const app = express();

const corsOptions: cors.CorsOptions = {
  // Keep the frontend's localhost ports aligned with the development server.
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

// Log API traffic during local development so request and response details are
// visible in the backend terminal as well as the browser's Network panel.
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const startedAt = Date.now();
    const originalJson = res.json.bind(res);
    let responseBody: unknown;

    res.json = ((body: unknown) => {
      responseBody = body;
      return originalJson(body);
    }) as typeof res.json;

    res.on('finish', () => {
      console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - startedAt}ms)`);
      if (req.body && Object.keys(req.body).length > 0) {
        console.log('  Request:', JSON.stringify(req.body, null, 2));
      }
      if (responseBody !== undefined) {
        console.log('  Response:', JSON.stringify(responseBody, null, 2));
      }
    });

    next();
  });
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TaskFlow API is running!' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorMiddleware);

export default app;
