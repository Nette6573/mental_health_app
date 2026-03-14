import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { chatRouter } from '../routes/chat';

// Initialize Hono app
const app = new Hono<{
  Bindings: {
    AI_GATEWAY_URL: string;
    OPENAI_API_KEY: string;
  }
}>();

// Middleware
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true,
}));

// Routes
app.route('/api/chat', chatRouter);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// Add this temporary debug route to see all registered routes
app.get('/debug/routes', (c) => {
  // This is a simple way to list routes - you'll need to adapt based on your router
  return c.json({ 
    message: "Available routes should start with /api/chat/",
    endpoints: [
      "POST /api/chat/send",
      "GET /api/chat/history/:sessionId",
      "GET /api/chat/sessions/:userId",
      "DELETE /api/chat/session/:sessionId",
      "GET /health"
    ]
  });
});

export default app;