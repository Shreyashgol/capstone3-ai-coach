import { db } from '../db/prisma.js';

export class ResumeModel {
  static async findByUserId(userId) {
    return await db.resume.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async create(resumeData) {
    return await db.resume.create({
      data: resumeData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async update(userId, updateData) {
    return await db.resume.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async delete(userId) {
    return await db.resume.delete({
      where: { userId }
    });
  }

  static async updateAtsScore(userId, atsScore, feedback) {
    return await db.resume.update({
      where: { userId },
      data: { atsScore, feedback },
      select: {
        id: true,
        atsScore: true,
        feedback: true,
        updatedAt: true
      }
    });
  }
}
