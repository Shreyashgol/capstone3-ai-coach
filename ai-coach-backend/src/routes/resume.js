import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";
import { db } from "../db/prisma.js";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
    if (!current || !type) {
      return res.status(400).json({ error: "Current content and type are required" });
    }

    if (current.trim().length < 10) {
      return res.status(400).json({ error: "Please provide more text to improve (at least 10 characters)" });
    }

    const industry = user.industry || "general";

    console.log(`Improving resume text for user ${user.id}, industry: ${industry}, text length: ${current.length}`);

    const prompt = `
      You are a professional resume writer and career coach.
      Improve the following section of a resume for a candidate in the "${industry}" industry.

      Section type: ${type}
      Industry: ${industry}

      Original section:
      """
      ${current}
      """

      Instructions:
      - Make the text more impactful and professional
      - Use action verbs and quantifiable achievements where possible
      - Optimize for ATS (Applicant Tracking System) compatibility
      - Keep the same general structure and meaning
      - Return ONLY the improved text, no explanations

      Improved section:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const improved = text.trim();

    console.log(`Text improvement completed for user ${user.id}`);
    res.json({ 
      improved,
      success: true,
      message: "Text improved successfully"
    });
  } catch (err) {
    console.error('Resume improvement error:', err);
    if (err.message.includes('API_KEY')) {
      res.status(500).json({ error: "AI service configuration error. Please contact support." });
    } else {
      res.status(500).json({ error: "Failed to improve content. Please try again." });
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

    const prompt = `
      You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer.
      
      Analyze this resume for ATS compatibility and provide a comprehensive assessment.
      
      Resume content:
      """
      ${resume.content}
      """
      
      Provide a detailed analysis with:
      1. ATS score (0-100) based on formatting, keywords, structure
      2. Specific feedback on what works well and what needs improvement
      3. List of strengths (3-5 items)
      4. List of specific improvements needed (3-5 items)
      
      Return ONLY a valid JSON object in this exact format:
      {
        "atsScore": 85,
        "feedback": "Your resume shows strong technical skills and clear formatting. The experience section is well-structured with quantifiable achievements. However, consider adding more industry-specific keywords and improving the skills section organization.",
        "strengths": ["Clear formatting and structure", "Quantifiable achievements", "Relevant technical skills", "Professional summary"],
        "improvements": ["Add more industry keywords", "Improve skills section", "Include more metrics", "Optimize section headers"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);
    
    // Try to extract JSON from the response
    let analysis;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
        
        // Validate the analysis structure
        if (!analysis.atsScore || !analysis.feedback) {
          throw new Error('Invalid analysis structure');
        }
        
        // Ensure atsScore is a number between 0 and 100
        analysis.atsScore = Math.max(0, Math.min(100, parseInt(analysis.atsScore) || 75));
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        analysis = {
          atsScore: 75,
          feedback: "Resume analysis completed. The content shows professional structure but could benefit from optimization for ATS systems.",
          strengths: ["Professional format", "Clear content structure", "Readable layout"],
          improvements: ["Add more industry keywords", "Improve section organization", "Include more quantifiable achievements"]
        };
      }
    } else {
      // Fallback if no JSON found
      analysis = {
        atsScore: 70,
        feedback: "Resume analysis completed. Consider optimizing for ATS compatibility by adding more keywords and improving formatting.",
        strengths: ["Professional appearance", "Clear structure"],
        improvements: ["Add industry-specific keywords", "Improve formatting", "Include more metrics"]
      };
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

