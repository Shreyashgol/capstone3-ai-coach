import { db } from '../db/prisma.js';

export class AssessmentModel {
  static async findByUserId(userId) {
    return await db.assessment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findById(id) {
    return await db.assessment.findUnique({
      where: { id },
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

  static async create(assessmentData) {
    return await db.assessment.create({
      data: assessmentData,
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

  static async update(id, updateData) {
    return await db.assessment.update({
      where: { id },
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

  static async delete(id) {
    return await db.assessment.delete({
      where: { id }
    });
  }

  static async findByCategory(userId, category) {
    return await db.assessment.findMany({
      where: { 
        userId,
        category 
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
