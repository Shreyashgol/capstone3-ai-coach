import { db } from '../db/prisma.js';

export class UserModel {
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
    const user = await db.user.create({
      data: userData
    });
    
    // For compatibility, set clerkUserId to id if not provided
    if (!userData.clerkUserId) {
      await db.user.update({
        where: { id: user.id },
        data: { clerkUserId: user.id }
      });
    }
    
    return user;
  }

  static async update(id, updateData) {
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
    return await db.user.update({
      where: { id: userId },
      data: { industry },
      select: {
        id: true,
        email: true,
        name: true,
        industry: true
      }
    });
  }
}
