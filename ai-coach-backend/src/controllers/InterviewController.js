import { UserModel, AssessmentModel } from '../models/index.js';
import AIService from '../services/AIService.js';

class InterviewController {
  constructor() {
    this.aiService = new AIService();
  }

  static getUserId(req) {
    return req.userId || req.header('x-user-id');
  }

  static async generateQuiz(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId 
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const aiService = new AIService();
      const quizData = await aiService.generateInterviewQuestions(user.industry, user.experience);
      
      // Transform the data to match the expected format for multiple choice
      const questions = quizData.questions.map(q => ({
        question: q.question,
        options: [
          q.expectedAnswer,
          'Option B - Alternative answer',
          'Option C - Another alternative',
          'Option D - Final option'
        ],
        correctAnswer: q.expectedAnswer,
        explanation: `This is a ${q.type} question. Look for: ${q.expectedAnswer}`,
        type: q.type
      }));

      res.json({ questions });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  }

  static async saveQuizResult(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { questions = [], answers = [], score = 0 } = req.body || {};

      const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
      }));

      const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
      let improvementTip = null;

      if (wrongAnswers.length > 0) {
        const aiService = new AIService();
        const wrongQuestionsText = wrongAnswers.map((q) => 
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        ).join('\n\n');

        const improvementPrompt = `
          The user got the following ${user.industry} technical interview questions wrong:
          ${wrongQuestionsText}
          Based on these mistakes, provide a concise, specific improvement tip.
          Keep the response under 2 sentences and make it encouraging.
          Don't explicitly mention the mistakes, focus on what to learn/practice.
        `;

        try {
          const tipResult = await aiService.model.generateContent(improvementPrompt);
          improvementTip = tipResult.response.text().trim();
        } catch (_) {
          // ignore tip errors
        }
      }

      const assessment = await AssessmentModel.create({
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: 'Technical',
        improvementTip,
      });

      res.json(assessment);
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to save quiz result' });
    }
  }

  static async getAssessments(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const assessments = await AssessmentModel.findByUserId(user.id);

      res.json({ assessments });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  }

  static async getAssessmentById(req, res) {
    try {
      const { id } = req.params;
      const userId = InterviewController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const assessment = await AssessmentModel.findById(id);

      if (!assessment || assessment.userId !== user.id) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      res.json({ assessment });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to fetch assessment' });
    }
  }

  static async deleteAssessment(req, res) {
    try {
      const { id } = req.params;
      const userId = InterviewController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if assessment exists and belongs to user
      const existingAssessment = await AssessmentModel.findById(id);

      if (!existingAssessment || existingAssessment.userId !== user.id) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      await AssessmentModel.delete(id);

      res.json({ message: 'Assessment deleted successfully' });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to delete assessment' });
    }
  }
}

export default InterviewController;
