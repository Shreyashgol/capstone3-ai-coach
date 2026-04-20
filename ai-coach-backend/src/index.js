import express from "express";
import cors from "cors";
import "dotenv/config";
import { authMiddleware } from "./middleware/auth.js";
import { serve } from "inngest/express";
import { inngest, updateIndustryInsights, triggerIndustryUpdate, sendIndustryInsights } from "./services/InngestService.js";
import { db } from "./db/prisma.js";

import coverLetterRouter from "./routes/coverLetter.js";
import interviewRouter from "./routes/interview.js";
import userRouter from "./routes/user.js";
import resumeRouter from "./routes/resume.js";
import dashboardRouter from "./routes/dashboard.js";
import jwtAuthRouter from "./routes/jwtAuth.js";

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4001'
];

const configuredOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const resolvedAllowedOrigins = [...new Set([...allowedOrigins, ...configuredOrigins])];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (resolvedAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.options('*', cors(corsOptions));

app.use(authMiddleware);

app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 AI Coach Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      auth: "/api/auth/*",
      coverLetters: "/api/cover-letters/*",
      interview: "/api/interview/*",
      user: "/api/user/*",
      resume: "/api/resume/*",
      dashboard: "/api/dashboard/*"
    }
  });
});

app.get("/health", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({
      ok: true,
      database: "connected"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      ok: false,
      database: "disconnected"
    });
  }
});

app.use("/api/auth", jwtAuthRouter); 
app.use("/api/cover-letters", coverLetterRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/dashboard", dashboardRouter);

app.use("/api/inngest", serve({
  client: inngest,
  functions: [
    updateIndustryInsights,
    triggerIndustryUpdate,
    sendIndustryInsights
  ]
}));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`🚀 AI Coach Backend running on http://localhost:${port}`);
});
