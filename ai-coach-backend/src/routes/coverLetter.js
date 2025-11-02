import { Router } from "express";
import CoverLetterController from "../controllers/CoverLetterController.js";

const router = Router();

// Generate cover letter with AI
router.post("/generate", CoverLetterController.generateCoverLetter);

// Get all cover letters for user
router.get("/", CoverLetterController.getCoverLetters);

// Get specific cover letter by ID
router.get('/:id', CoverLetterController.getCoverLetter);

// Create cover letter manually
router.post("/", CoverLetterController.createCoverLetter);

// Update cover letter
router.put('/:id', CoverLetterController.updateCoverLetter);

// Update cover letter status
router.patch('/:id/status', CoverLetterController.updateStatus);

// Delete cover letter
router.delete('/:id', CoverLetterController.deleteCoverLetter);

export default router;

