import { db } from '../db/prisma.js';

export class UserModel {
  static async ensureIndustryInsight(industry) {
    if (!industry) return;

    const normalizedIndustry = typeof industry === 'string' ? industry.trim() : industry;
    if (!normalizedIndustry) return;

    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 7);

    await db.industryInsight.upsert({
      where: { industry: normalizedIndustry },
      update: {},
      create: {
        industry: normalizedIndustry,
        salaryRanges: [],
        growthRate: 0,
        demandLevel: 'Unknown',
        topSkills: [],
        marketOutlook: 'Insights pending generation.',
        keyTrends: [],
        recommendedSkills: [],
        nextUpdate
      }
    });
  }

  static async findById(id) {
    return await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        industry: true,
        bio: true,
        experience: true,
        skills: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async findByEmail(email) {
    return await db.user.findUnique({
      where: { email }
    });
  }

  static async findByClerkUserId(clerkUserId) {
    return await db.user.findUnique({
      where: { clerkUserId }
    });
  }

  static async create(userData) {
    // Set clerkUserId to the generated user ID for JWT auth compatibility
    const createData = {
      ...userData,
      clerkUserId: userData.clerkUserId || null // Will be set after user creation
    };
    
    const user = await db.user.create({
      data: createData
    });
    
    // Update clerkUserId to the user's ID for compatibility
    if (!userData.clerkUserId) {
      await db.user.update({
        where: { id: user.id },
        data: { clerkUserId: user.id }
      });
      
      // Return updated user with clerkUserId
      return await db.user.findUnique({
        where: { id: user.id }
      });
    }
    
    return user;
  }

  static async update(id, updateData) {
    if (updateData.industry !== undefined) {
      await UserModel.ensureIndustryInsight(updateData.industry);
      if (typeof updateData.industry === 'string') {
        updateData.industry = updateData.industry.trim();
      }
    }

    return await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        industry: true,
        bio: true,
        experience: true,
        skills: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async delete(id) {
    return await db.user.delete({
      where: { id }
    });
  }

  static async getOnboardingStatus(userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { industry: true }
    });
    return { isOnboarded: !!user?.industry };
  }

  static async updateIndustry(userId, industry) {
    await UserModel.ensureIndustryInsight(industry);

    return await db.user.update({
      where: { id: userId },
      data: { industry: typeof industry === 'string' ? industry.trim() : industry },
      select: {
        id: true,
        email: true,
        name: true,
        industry: true
      }
    });
  }
}
