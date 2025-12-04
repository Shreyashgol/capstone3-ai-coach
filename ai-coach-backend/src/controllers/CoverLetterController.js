import { CoverLetterModel, UserModel } from '../models/index.js';
import AIService from '../services/AIService.js';

class CoverLetterController {
  static getUserId(req) {
    return req.userId;
  }

  static async generateCoverLetter(req, res) {
    try {
      const userId = CoverLetterController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { jobTitle, companyName, jobDescription } = req.body || {};
      
      if (!jobTitle || !companyName) {
        return res.status(400).json({ 
          error: "Job title and company name are required" 
        });
      }

      const aiService = new AIService();
      const resumeText = `${user.bio}\nSkills: ${(user.skills || []).join(", ")}\nExperience: ${user.experience} years in ${user.industry}`;
      
      const aiResult = await aiService.generateCoverLetter(resumeText, jobDescription, companyName, jobTitle);
      
      const coverLetter = await CoverLetterModel.create({
        userId: user.id,
        content: aiResult.content,
        jobDescription,
        companyName,
        jobTitle,
        status: "completed"
      });

      res.json(coverLetter);
    } catch (err) {
      console.error("Generate cover letter error:", err);
      res.status(500).json({ error: "Failed to generate cover letter" });
    }
  }

  static async getCoverLetters(req, res) {
    try {
      const userId = CoverLetterController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const coverLetters = await CoverLetterModel.findByUserId(userId);
      res.json({ coverLetters });
    } catch (error) {
      console.error('Get cover letters error:', error);
      res.status(500).json({ 
        error: 'Failed to get cover letters' 
      });
    }
  }

  static async getCoverLetter(req, res) {
    try {
      const { id } = req.params;
      const userId = CoverLetterController.getUserId(req);
      
      console.log(`Getting cover letter ${id} for user ${userId}`);
      
      if (!userId) {
        console.log('No userId found in request');
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const coverLetter = await CoverLetterModel.findById(id);
      
      if (!coverLetter) {
        console.log(`Cover letter ${id} not found`);
        return res.status(404).json({ 
          error: 'Cover letter not found' 
        });
      }

      // Check if user owns this cover letter
      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);
      
      console.log(`Cover letter userId: ${coverLetter.userId}, User ID: ${user?.id}`);
      
      if (!user || coverLetter.userId !== user.id) {
        console.log('Access denied - user does not own this cover letter');
        return res.status(403).json({ 
          error: 'Access denied' 
        });
      }

      console.log('Cover letter found and authorized, returning data');
      res.json({ coverLetter });
    } catch (error) {
      console.error('Get cover letter error:', error);
      res.status(500).json({ 
        error: 'Failed to get cover letter',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async createCoverLetter(req, res) {
    try {
      const userId = CoverLetterController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { 
        content, 
        jobDescription, 
        companyName, 
        jobTitle, 
        status = 'draft' 
      } = req.body;

      if (!content || !companyName || !jobTitle) {
        return res.status(400).json({ 
          error: 'Content, company name, and job title are required' 
        });
      }

      const coverLetter = await CoverLetterModel.create({
        userId,
        content,
        jobDescription,
        companyName,
        jobTitle,
        status
      });

      res.status(201).json({ 
        message: 'Cover letter created successfully',
        coverLetter 
      });
    } catch (error) {
      console.error('Create cover letter error:', error);
      res.status(500).json({ 
        error: 'Failed to create cover letter' 
      });
    }
  }

  static async updateCoverLetter(req, res) {
    try {
      const { id } = req.params;
      const userId = CoverLetterController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      // Check if cover letter exists and user owns it
      const existingCoverLetter = await CoverLetterModel.findById(id);
      if (!existingCoverLetter) {
        return res.status(404).json({ 
          error: 'Cover letter not found' 
        });
      }

      if (existingCoverLetter.userId !== userId) {
        return res.status(403).json({ 
          error: 'Access denied' 
        });
      }

      const { 
        content, 
        jobDescription, 
        companyName, 
        jobTitle, 
        status 
      } = req.body;

      const updateData = {};
      if (content !== undefined) updateData.content = content;
      if (jobDescription !== undefined) updateData.jobDescription = jobDescription;
      if (companyName !== undefined) updateData.companyName = companyName;
      if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
      if (status !== undefined) updateData.status = status;

      const coverLetter = await CoverLetterModel.update(id, updateData);

      res.json({ 
        message: 'Cover letter updated successfully',
        coverLetter 
      });
    } catch (error) {
      console.error('Update cover letter error:', error);
      res.status(500).json({ 
        error: 'Failed to update cover letter' 
      });
    }
  }

  static async deleteCoverLetter(req, res) {
    try {
      const { id } = req.params;
      const userId = CoverLetterController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      // Check if cover letter exists and user owns it
      const existingCoverLetter = await CoverLetterModel.findById(id);
      if (!existingCoverLetter) {
        return res.status(404).json({ 
          error: 'Cover letter not found' 
        });
      }

      if (existingCoverLetter.userId !== userId) {
        return res.status(403).json({ 
          error: 'Access denied' 
        });
      }

      await CoverLetterModel.delete(id);

      res.json({ 
        message: 'Cover letter deleted successfully' 
      });
    } catch (error) {
      console.error('Delete cover letter error:', error);
      res.status(500).json({ 
        error: 'Failed to delete cover letter' 
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = CoverLetterController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      // Check if cover letter exists and user owns it
      const existingCoverLetter = await CoverLetterModel.findById(id);
      if (!existingCoverLetter) {
        return res.status(404).json({ 
          error: 'Cover letter not found' 
        });
      }

      if (existingCoverLetter.userId !== userId) {
        return res.status(403).json({ 
          error: 'Access denied' 
        });
      }

      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ 
          error: 'Status is required' 
        });
      }

      const coverLetter = await CoverLetterModel.updateStatus(id, status);

      res.json({ 
        message: 'Cover letter status updated successfully',
        coverLetter 
      });
    } catch (error) {
      console.error('Update cover letter status error:', error);
      res.status(500).json({ 
        error: 'Failed to update cover letter status' 
      });
    }
  }
}

export default CoverLetterController;
