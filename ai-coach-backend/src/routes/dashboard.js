import { Router } from "express";
import DashboardController from "../controllers/DashboardController.js";

const router = Router();

// Fetch or create insights for the current user's industry
router.get('/insights', DashboardController.getIndustryInsights);

// Refresh industry insights
router.post('/insights/refresh', DashboardController.refreshIndustryInsights);

// Get dashboard statistics
router.get('/stats', DashboardController.getDashboardStats);

export default router;

