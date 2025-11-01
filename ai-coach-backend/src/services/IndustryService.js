import AIService from './AIService.js';
import { IndustryInsightModel } from '../models/index.js';

class IndustryService {
  constructor() {
    this.aiService = new AIService();
  }

  async getIndustryInsights(industry) {
    try {
      // Check if we have recent insights (less than 7 days old)
      let insights = await IndustryInsightModel.findByIndustry(industry);
      
      if (!insights || new Date() > insights.nextUpdate) {
        // Generate new insights using AI
        const newInsights = await this.aiService.generateIndustryInsights(industry);
        
        if (insights) {
          // Update existing insights
          insights = await IndustryInsightModel.update(industry, newInsights);
        } else {
          // Create new insights
          insights = await IndustryInsightModel.create(newInsights);
        }
      }
      
      return insights;
    } catch (error) {
      console.error('Industry Service Error:', error);
      throw error;
    }
  }

  async getAllIndustries() {
    try {
      return await IndustryInsightModel.getAll();
    } catch (error) {
      console.error('Get all industries error:', error);
      throw error;
    }
  }

  async refreshIndustryInsights(industry) {
    try {
      // Force refresh by generating new insights
      const newInsights = await this.aiService.generateIndustryInsights(industry);
      
      let insights = await IndustryInsightModel.findByIndustry(industry);
      if (insights) {
        insights = await IndustryInsightModel.update(industry, newInsights);
      } else {
        insights = await IndustryInsightModel.create(newInsights);
      }
      
      return insights;
    } catch (error) {
      console.error('Refresh industry insights error:', error);
      throw error;
    }
  }

  async getIndustriesNeedingUpdate() {
    try {
      return await IndustryInsightModel.getIndustriesNeedingUpdate();
    } catch (error) {
      console.error('Get industries needing update error:', error);
      throw error;
    }
  }
}

export default IndustryService;
