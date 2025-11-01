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
    const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
      Make it impactful, quantifiable, and aligned with industry standards.
      Current content: "${current}"
      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      Format the response as a single paragraph without any additional text or explanations.
    `;
    const result = await model.generateContent(prompt);
    const improved = result.response.text().trim();
    res.json({ improved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to improve content" });
  }
});

export default router;

