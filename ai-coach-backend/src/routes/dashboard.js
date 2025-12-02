import { Router } from "express";
import DashboardController from "../controllers/DashboardController.js";

const router = Router();

// Fetch or create insights for the current user's industry
router.get('/insights', DashboardController.getIndustryInsights);

// Refresh industry insights
router.post('/insights/refresh', DashboardController.refreshIndustryInsights);

// Get dashboard statistics
router.get('/stats', DashboardController.getDashboardStats);

// Get multiple industry insights for comparison (commented out for now)
// router.get('/industries', DashboardController.getMultipleIndustryInsights);

// Get job category insights (Software Engineer, Data Scientist, etc.)
router.get('/job-categories', DashboardController.getJobCategoryInsights);

// Get salary trends for specific job categories
router.get('/salary-trends', DashboardController.getSalaryTrends);

// Get comprehensive market insights
router.get('/market-insights', DashboardController.getMarketInsights);

// Get skill analytics and learning paths
router.get('/skill-analytics', DashboardController.getSkillAnalytics);

export default router;

