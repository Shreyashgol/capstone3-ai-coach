import express from "express";
import cors from "cors";
import "dotenv/config";
import { authMiddleware } from "./middleware/auth.js";
import { serve } from "inngest/express";
import { inngest, updateIndustryInsights, triggerIndustryUpdate, sendIndustryInsights } from "./services/InngestService.js";
import { db } from "./db/prisma.js";

// Import MVC routes
import coverLetterRouter from "./routes/coverLetter.js";
import interviewRouter from "./routes/interview.js";
import userRouter from "./routes/user.js";
import resumeRouter from "./routes/resume.js";
import dashboardRouter from "./routes/dashboard.js";
import jwtAuthRouter from "./routes/jwtAuth.js";

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ai-coach-frontend.onrender.com', 'https://ai-coach.onrender.com']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(authMiddleware);

// Health check
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ ok: false, database: 'disconnected', error: error.message });
  }
});

// API Routes - Updated to match frontend expectations
app.use("/api/auth", jwtAuthRouter); // JWT authentication routes
app.use("/api/cover-letters", coverLetterRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/dashboard", dashboardRouter);

// Inngest endpoint for background jobs
app.use("/api/inngest", serve({
  client: inngest,
  functions: [
    updateIndustryInsights,
    triggerIndustryUpdate,
    sendIndustryInsights
  ]
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`🚀 AI Coach Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation:`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   POST /api/auth/register - User registration`);
  console.log(`   GET /api/auth/me - Get current user`);
  console.log(`   POST /api/auth/logout - User logout`);
});

