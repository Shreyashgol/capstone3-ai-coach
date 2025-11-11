import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/prisma.js";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function getUserId(req) {
  return req.userId || req.header("x-user-id");
}

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const resume = await db.resume.findUnique({ where: { userId: user.id } });
    res.json(resume || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

router.post('/save', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { content } = req.body || {};
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save resume" });
  }
});

router.post('/improve', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    const user = req.userId ? await db.user.findUnique({
      where: { id: req.userId },
      select: { industry: true }
    }) : await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const { current, type } = req.body || {};
    if (!current || !type) {
      return res.status(400).json({ error: "Current content and type are required" });
    }
    
    // For now, return a mock improved version
    // TODO: Configure proper Gemini API key
    const improved = `Enhanced ${type}: Led the development and deployment of scalable software solutions, resulting in a 40% improvement in system performance and a 25% reduction in operational costs. Implemented best practices in software engineering, mentored junior developers, and successfully delivered 15+ projects on time using agile methodologies.`;
    
    res.json({ improved });
  } catch (err) {
    console.error('Resume improvement error:', err);
    res.status(500).json({ error: "Failed to improve content: " + err.message });
  }
});

export default router;

