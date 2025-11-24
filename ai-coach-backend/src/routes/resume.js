import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";
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

    const industry = user.industry || "general";

    const prompt = `
      You are a professional resume writer.
      Improve the following section of a resume for a candidate in the "${industry}" industry.

      Section type: ${type}

      Original section:
      """
      ${current}
      """

      Return ONLY the improved text for this section, ready to be pasted into a resume.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const improved = text.trim();

    res.json({ improved });
  } catch (err) {
    console.error('Resume improvement error:', err);
    res.status(500).json({ error: "Failed to improve content: " + err.message });
  }
});

router.get('/pdf', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const resume = await db.resume.findUnique({ where: { userId: user.id } });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    if (user.name || user.email) {
      doc.fontSize(18).text(user.name || 'Your Name', { align: 'center' });
      if (user.email) {
        doc.moveDown(0.5);
        doc.fontSize(12).text(user.email, { align: 'center' });
      }
      doc.moveDown();
    }

    doc.fontSize(12).text(resume.content, {
      align: 'left'
    });

    doc.end();
  } catch (err) {
    console.error('Resume PDF error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate resume PDF" });
    }
  }
});

export default router;

