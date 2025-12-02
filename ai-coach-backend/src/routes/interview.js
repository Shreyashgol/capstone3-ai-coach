import { Router } from "express";
import InterviewController from "../controllers/InterviewController.js";

const router = Router();

// Generate interview quiz
router.post('/generate-quiz', InterviewController.generateQuiz);

// Save quiz result
router.post('/save-result', InterviewController.saveQuizResult);

// Get all assessments for user
router.get('/assessments', InterviewController.getAssessments);

// Get specific assessment by ID
router.get('/assessments/:id', InterviewController.getAssessmentById);

// Delete assessment
router.delete('/assessments/:id', InterviewController.deleteAssessment);

// Get todos for user
router.get('/todos', InterviewController.getTodos);

// Mark todo as complete/incomplete
router.patch('/todos/:id/complete', InterviewController.markTodoComplete);

// Delete a specific todo
router.delete('/todos/:id', InterviewController.deleteTodo);

// Get quiz history for user
router.get('/quiz-history', InterviewController.getQuizHistory);

export default router;

