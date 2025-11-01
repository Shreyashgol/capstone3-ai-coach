import express from "express";
import cors from "cors";
import "dotenv/config";
import { authMiddleware } from "./middleware/auth.js";

// Import MVC routes
import coverLetterRouter from "./routes/coverLetter.js";
import interviewRouter from "./routes/interview.js";
import userRouter from "./routes/user.js";
import resumeRouter from "./routes/resume.js";
import dashboardRouter from "./routes/dashboard.js";
import jwtAuthRouter from "./routes/jwtAuth.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(authMiddleware);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// API Routes - Updated to match frontend expectations
app.use("/api/auth", jwtAuthRouter); // JWT authentication routes
app.use("/api/cover-letters", coverLetterRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/dashboard", dashboardRouter);

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 AI Coach Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation:`);
  console.log(`   POST /api/auth/login - User login`);
  console.log(`   POST /api/auth/register - User registration`);
  console.log(`   GET /api/auth/me - Get current user`);
  console.log(`   POST /api/auth/logout - User logout`);
});

