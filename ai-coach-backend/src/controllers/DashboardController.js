import { UserModel, AssessmentModel, CoverLetterModel } from '../models/index.js';
import IndustryService from '../services/IndustryService.js';

class DashboardController {
  constructor() {
    this.industryService = new IndustryService();
  }

  static getUserId(req) {
    return req.userId || req.header('x-user-id');
  }

  static async getIndustryInsights(req, res) {
    try {
      const clerkUserId = req.header('x-user-id');
      if (!clerkUserId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await UserModel.findByClerkUserId(clerkUserId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.industry) {
        return res.status(400).json({ error: 'User has no industry set' });
      }

      const industryService = new IndustryService();
      const insight = await industryService.getIndustryInsights(user.industry);

      return res.json(insight);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to fetch insights' });
    }
  }

  static async refreshIndustryInsights(req, res) {
    try {
      const clerkUserId = req.header('x-user-id');
      if (!clerkUserId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await UserModel.findByClerkUserId(clerkUserId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.industry) {
        return res.status(400).json({ error: 'User has no industry set' });
      }

      const industryService = new IndustryService();
      const insight = await industryService.refreshIndustryInsights(user.industry);

      return res.json(insight);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to refresh insights' });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId 
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get various stats for dashboard
      const [coverLetters, assessments] = await Promise.all([
        CoverLetterModel.findByUserId(user.id),
        AssessmentModel.findByUserId(user.id)
      ]);

      const stats = {
        coverLettersCount: coverLetters.length,
        assessmentsCount: assessments.length,
        recentAssessments: assessments.slice(0, 5).map(a => ({
          id: a.id,
          quizScore: a.quizScore,
          category: a.category,
          createdAt: a.createdAt
        })),
        user: {
          industry: user.industry,
          experience: user.experience,
          skills: user.skills
        }
      };

      return res.json(stats);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }
}

export default DashboardController;
