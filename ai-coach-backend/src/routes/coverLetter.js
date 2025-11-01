import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/prisma.js";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function getUserId(req) {
  return req.userId || req.header("x-user-id");
}

router.post("/generate", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { jobTitle, companyName, jobDescription } = req.body || {};
    const prompt = `
      Write a professional cover letter for a ${jobTitle} position at ${companyName}.
      About the candidate:
      - Industry: ${user.industry}
      - Years of Experience: ${user.experience}
      - Skills: ${(user.skills || []).join(", ")}
      - Professional Background: ${user.bio}
      Job Description:
      ${jobDescription}
      Requirements:
      1. Use a professional, enthusiastic tone
      2. Highlight relevant skills and experience
      3. Show understanding of the company's needs
      4. Keep it concise (max 400 words)
      5. Use proper business letter formatting in markdown
      6. Include specific examples of achievements
      7. Relate candidate's background to job requirements
      Format the letter in markdown.
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription,
        companyName,
        jobTitle,
        status: "completed",
        userId: user.id,
      },
    });
    res.json(coverLetter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const list = await db.coverLetter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cover letters" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const item = await db.coverLetter.findUnique({
      where: { id: req.params.id, userId: user.id },
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cover letter" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const deleted = await db.coverLetter.delete({
      where: { id: req.params.id, userId: user.id },
    });
    res.json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete cover letter" });
  }
});

export default router;

