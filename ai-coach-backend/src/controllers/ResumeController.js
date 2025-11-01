import { ResumeModel } from '../models/index.js';

class ResumeController {
  static getUserId(req) {
    return req.userId || req.header('x-user-id');
  }

  static async getResume(req, res) {
    try {
      const userId = ResumeController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const resume = await ResumeModel.findByUserId(userId);
      
      if (!resume) {
        return res.status(404).json({ 
          error: 'Resume not found' 
        });
      }

      res.json({ resume });
    } catch (error) {
      console.error('Get resume error:', error);
      res.status(500).json({ 
        error: 'Failed to get resume' 
      });
    }
  }

  static async createResume(req, res) {
    try {
      const userId = ResumeController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ 
          error: 'Resume content is required' 
        });
      }

      const resume = await ResumeModel.create({
        userId,
        content
      });

      res.status(201).json({ 
        message: 'Resume created successfully',
        resume 
      });
    } catch (error) {
      console.error('Create resume error:', error);
      res.status(500).json({ 
        error: 'Failed to create resume' 
      });
    }
  }

  static async updateResume(req, res) {
    try {
      const userId = ResumeController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ 
          error: 'Resume content is required' 
        });
      }

      const resume = await ResumeModel.update(userId, { content });

      res.json({ 
        message: 'Resume updated successfully',
        resume 
      });
    } catch (error) {
      console.error('Update resume error:', error);
      res.status(500).json({ 
        error: 'Failed to update resume' 
      });
    }
  }

  static async deleteResume(req, res) {
    try {
      const userId = ResumeController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      await ResumeModel.delete(userId);

      res.json({ 
        message: 'Resume deleted successfully' 
      });
    } catch (error) {
      console.error('Delete resume error:', error);
      res.status(500).json({ 
        error: 'Failed to delete resume' 
      });
    }
  }

  static async updateAtsScore(req, res) {
    try {
      const userId = ResumeController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { atsScore, feedback } = req.body;

      if (atsScore === undefined || !feedback) {
        return res.status(400).json({ 
          error: 'ATS score and feedback are required' 
        });
      }

      const resume = await ResumeModel.updateAtsScore(userId, atsScore, feedback);

      res.json({ 
        message: 'ATS score updated successfully',
        resume 
      });
    } catch (error) {
      console.error('Update ATS score error:', error);
      res.status(500).json({ 
        error: 'Failed to update ATS score' 
      });
    }
  }
}

export default ResumeController;
