import { Router } from "express";
import { db } from "../db/prisma.js";

const router = Router();

function getUserId(req) {
  return req.userId;
}

router.get('/onboarding-status', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { industry: true }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ isOnboarded: !!user.industry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get onboarding status" });
  }
});

router.post('/update', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const existing = await db.user.findUnique({ where: { id: userId } });
    if (!existing) return res.status(404).json({ error: "User not found" });

    const { industry, experience, bio, skills } = req.body || {};
    const updated = await db.user.update({
      where: { id: existing.id },
      data: { industry, experience, bio, skills }
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;

