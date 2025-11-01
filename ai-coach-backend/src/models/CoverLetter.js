import { db } from '../db/prisma.js';

export class CoverLetterModel {
  static async findByUserId(userId) {
    return await db.coverLetter.findMany({
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
    return await db.coverLetter.findUnique({
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

  static async create(coverLetterData) {
    return await db.coverLetter.create({
      data: coverLetterData,
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
    return await db.coverLetter.update({
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
    return await db.coverLetter.delete({
      where: { id }
    });
  }

  static async updateStatus(id, status) {
    return await db.coverLetter.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        updatedAt: true
      }
    });
  }
}
