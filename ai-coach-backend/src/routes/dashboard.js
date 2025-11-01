import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/prisma.js";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateAIInsights(industry) {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleaned);
}

// Fetch or create insights for the current user's industry
router.get('/insights', async (req, res) => {
  try {
    const clerkUserId = req.header('x-user-id');
    if (!clerkUserId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: { industryInsight: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.industry) return res.status(400).json({ error: 'User has no industry set' });

    let insight = await db.industryInsight.findUnique({ where: { industry: user.industry } });
    if (!insight) {
      const insights = await generateAIInsights(user.industry);
      insight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return res.json(insight);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

export default router;

