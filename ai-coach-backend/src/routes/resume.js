import { Router } from "express";
import PDFDocument from "pdfkit";
import { db } from "../db/prisma.js";
import AIService from "../services/AIService.js";

const router = Router();

// Use shared AI service
const aiService = new AIService();

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
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Resume content cannot be empty" });
    }
    
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content: content.trim() },
      create: { userId: user.id, content: content.trim() },
    });
    
    console.log(`Resume saved for user ${user.id}, content length: ${content.length}`);
    res.json({ 
      message: "Resume saved successfully",
      resume,
      success: true 
    });
  } catch (err) {
    console.error('Resume save error:', err);
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
    
    console.log('Improve request body:', { current: current?.substring(0, 100) + '...', type });
    
    if (!current || !type) {
      return res.status(400).json({ error: "Current content and type are required" });
    }

    if (typeof current !== 'string' || current.trim().length < 10) {
      return res.status(400).json({ error: "Please provide more text to improve (at least 10 characters)" });
    }

    if (current.trim().length > 5000) {
      return res.status(400).json({ error: "Text is too long. Please provide less than 5000 characters." });
    }

    const industry = user.industry || "general";

    console.log(`Improving resume text for user ${user.id}, industry: ${industry}, text length: ${current.length}`);

    const result = await aiService.improveResumeContent(current, type, industry);
    
    if (!result.success) {
      throw new Error(result.error || 'AI service failed');
    }
    
    const improved = result.improved;

    console.log(`Text improvement completed for user ${user.id}`);
    res.json({ 
      improved,
      success: true,
      message: "Text improved successfully"
    });
  } catch (err) {
    console.error('Resume improvement error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    if (err.message.includes('API_KEY') || err.message.includes('GEMINI')) {
      res.status(500).json({ 
        error: "AI service configuration error. Please contact support.",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    } else if (err.message.includes('quota') || err.message.includes('limit')) {
      res.status(500).json({ error: "AI service temporarily unavailable. Please try again later." });
    } else {
      res.status(500).json({ 
        error: "Failed to improve content. Please try again.",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
});

router.get('/ats-score', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const resume = await db.resume.findUnique({ where: { userId: user.id } });
    if (!resume) return res.status(404).json({ error: "Resume not found. Please save your resume first." });

    if (!resume.content || resume.content.trim().length < 100) {
      return res.status(400).json({ error: "Resume content is too short for accurate analysis. Please add more content." });
    }

    console.log(`Analyzing ATS score for user ${user.id}, content length: ${resume.content.length}`);

    const analysis = await aiService.analyzeResumeATS(resume.content);
    
    if (!analysis.success) {
      console.warn('AI ATS analysis failed, using fallback data');
    }
    
    // Update resume with ATS score
    await db.resume.update({
      where: { userId: user.id },
      data: { 
        atsScore: analysis.atsScore,
        feedback: analysis.feedback 
      }
    });

    console.log(`ATS analysis completed for user ${user.id}, score: ${analysis.atsScore}`);
    res.json({
      ...analysis,
      success: true,
      message: "ATS analysis completed successfully"
    });
    
  } catch (err) {
    console.error('ATS score error:', err);
    if (err.message.includes('API_KEY')) {
      res.status(500).json({ error: "AI service configuration error. Please contact support." });
    } else {
      res.status(500).json({ error: "Failed to analyze resume. Please try again." });
    }
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

