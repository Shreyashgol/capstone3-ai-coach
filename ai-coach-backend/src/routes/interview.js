import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/prisma.js";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function getUserId(req) {
  return req.userId || req.header("x-user-id");
}

router.post('/generate-quiz', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId ? await db.user.findUnique({
      where: { id: req.userId },
      select: { industry: true, skills: true }
    }) : await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true, skills: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const prompt = `
      Generate 10 technical interview questions for a ${user.industry} professional${(user.skills && user.skills.length) ? ` with expertise in ${user.skills.join(', ')}` : ''}.
      Each question should be multiple choice with 4 options.
      Return the response in this JSON format only, no additional text:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string",
            "explanation": "string"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```(?:json)?\n?/g, '').trim();
    const quiz = JSON.parse(cleaned);
    res.json(quiz.questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

router.post('/save-result', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { questions = [], answers = [], score = 0 } = req.body || {};

    const questionResults = questions.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
    let improvementTip = null;
    if (wrongAnswers.length > 0) {
      const wrongQuestionsText = wrongAnswers.map((q) => `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`).join("\n\n");
      const improvementPrompt = `
        The user got the following ${user.industry} technical interview questions wrong:
        ${wrongQuestionsText}
        Based on these mistakes, provide a concise, specific improvement tip.
        Keep the response under 2 sentences and make it encouraging.
        Don't explicitly mention the mistakes, focus on what to learn/practice.
      `;
      try {
        const tipResult = await model.generateContent(improvementPrompt);
        improvementTip = tipResult.response.text().trim();
      } catch (_) {
        // ignore tip errors
      }
    }

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });
    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save quiz result" });
  }
});

router.get('/assessments', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = req.userId
      ? await db.user.findUnique({ where: { id: req.userId } })
      : await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });
    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

export default router;

