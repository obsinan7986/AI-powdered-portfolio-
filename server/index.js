/**
 * Portfolio API Server
 * Full-featured Express + MongoDB backend.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import 'dotenv/config';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { verifyEmailConnection } from './utils/email.js';

// Routes
import projectsRouter   from './routes/projects.js';
import experienceRouter from './routes/experience.js';
import skillsRouter     from './routes/skills.js';
import contactRouter    from './routes/contact.js';
import authRouter       from './routes/auth.js';
import cvRouter         from './routes/cv.js';
import adminRouter      from './routes/admin.js';
import chatRouter       from './routes/chat.js';

const app  = express();
const PORT = process.env.PORT || 5000;

/* ---- Security Middleware ---- */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/* ---- Global Rate Limiting (applied to all /api/* routes) ---- */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // More generous for reads
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

/* ---- Body Parsers ---- */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/* ---- Health check ---- */
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Portfolio API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

/* ---- API Routes ---- */
app.use('/api/projects',    projectsRouter);
app.use('/api/experience',  experienceRouter);
app.use('/api/skills',      skillsRouter);
app.use('/api/contact',     contactRouter);
app.use('/api/cv-download', cvRouter);
app.use('/api/auth',        authRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/chat',        chatRouter);

/* ---- 404 handler ---- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  });
});

/* ---- Global error handler (must be last) ---- */
app.use(errorHandler);

/* ---- Start Server ---- */
async function start() {
  await connectDB();

  if (process.env.NODE_ENV !== 'production') {
    await verifyEmailConnection();
  }

  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`    Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`    Health:      http://localhost:${PORT}/api/health`);
  });
}

start().catch((err) => {
  console.error('❌  Server failed to start:', err.message);
  process.exit(1);
});
