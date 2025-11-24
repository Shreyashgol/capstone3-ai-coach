import { UserModel } from '../models/index.js';

class UserController {
  static getUserId(req) {
    return req.userId;
  }

  static async getOnboardingStatus(req, res) {
    try {
      const userId = UserController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const status = await UserModel.getOnboardingStatus(userId);
      res.json(status);
    } catch (error) {
      console.error('Get onboarding status error:', error);
      res.status(500).json({ 
        error: 'Failed to get onboarding status' 
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = UserController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { name, bio, experience, skills, industry } = req.body;
      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (experience !== undefined) updateData.experience = experience;
      if (skills !== undefined) updateData.skills = skills;
      if (industry !== undefined) updateData.industry = industry;

      const user = await UserModel.update(userId, updateData);
      res.json({ 
        message: 'Profile updated successfully',
        user 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        error: 'Failed to update profile' 
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const userId = UserController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ 
        error: 'Failed to get profile' 
      });
    }
  }

  static async updateIndustry(req, res) {
    try {
      const userId = UserController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const { industry } = req.body;

      if (!industry) {
        return res.status(400).json({ 
          error: 'Industry is required' 
        });
      }

      const user = await UserModel.updateIndustry(userId, industry);
      res.json({ 
        message: 'Industry updated successfully',
        user 
      });
    } catch (error) {
      console.error('Update industry error:', error);
      res.status(500).json({ 
        error: 'Failed to update industry' 
      });
    }
  }
}

export default UserController;
