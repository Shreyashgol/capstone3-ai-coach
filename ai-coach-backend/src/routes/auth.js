import { Router } from "express";
import { db } from "../db/prisma.js";

const router = Router();

// Upsert a user record; expects clerkUserId and basic profile fields
router.post('/sync', async (req, res) => {
  try {
    const { clerkUserId, email, name, imageUrl } = req.body || {};
    if (!clerkUserId || !email) return res.status(400).json({ error: 'clerkUserId and email are required' });

    const user = await db.user.upsert({
      where: { clerkUserId },
      update: { email, name, imageUrl },
      create: { clerkUserId, email, name, imageUrl },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

export default router;

