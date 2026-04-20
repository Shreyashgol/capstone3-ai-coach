import { Router } from "express";
import { db } from "../db/prisma.js";
import { UserModel } from "../models/User.js";

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
    const updateData = { industry, experience, bio, skills };
    const updated = await UserModel.update(existing.id, updateData);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Get user preferences (theme, etc.)
router.get('/preferences', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { theme: true }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ theme: user.theme || 'dark' });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: "Failed to get preferences" });
  }
});

// Update user preferences (theme, etc.)
router.put('/preferences', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    
    const { theme } = req.body;
    
    if (!theme || !['light', 'dark'].includes(theme)) {
      return res.status(400).json({ error: "Invalid theme value" });
    }
    
    const updated = await db.user.update({
      where: { id: userId },
      data: { theme }
    });
    
    res.json({ theme: updated.theme, message: "Theme preference updated" });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

export default router;
