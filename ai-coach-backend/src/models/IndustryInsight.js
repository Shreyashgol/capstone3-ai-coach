import { db } from '../db/prisma.js';

export class IndustryInsightModel {
  static async findByIndustry(industry) {
    return await db.industryInsight.findUnique({
      where: { industry }
    });
  }

  static async create(insightData) {
    return await db.industryInsight.create({
      data: insightData
    });
  }

  static async update(industry, updateData) {
    return await db.industryInsight.update({
      where: { industry },
      data: updateData
    });
  }

  static async getAll() {
    return await db.industryInsight.findMany({
      orderBy: { industry: 'asc' }
    });
  }

  static async updateNextUpdate(industry, nextUpdateDate) {
    return await db.industryInsight.update({
      where: { industry },
      data: { 
        nextUpdate: nextUpdateDate,
        lastUpdated: new Date()
      }
    });
  }

  static async getIndustriesNeedingUpdate() {
    return await db.industryInsight.findMany({
      where: {
        nextUpdate: {
          lte: new Date()
        }
      }
    });
  }
}
