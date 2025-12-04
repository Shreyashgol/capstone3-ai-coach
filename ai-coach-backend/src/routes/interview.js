import { Router } from "express";
import InterviewController from "../controllers/InterviewController.js";

const router = Router();

router.post('/generate-quiz', InterviewController.generateQuiz);
router.post('/save-result', InterviewController.saveQuizResult);
router.get('/assessments', InterviewController.getAssessments);
router.get('/assessments/:id', InterviewController.getAssessmentById);
router.delete('/assessments/:id', InterviewController.deleteAssessment);
router.get('/todos', InterviewController.getTodos);
router.patch('/todos/:id/complete', InterviewController.markTodoComplete);
router.delete('/todos/:id', InterviewController.deleteTodo);
router.get('/quiz-history', InterviewController.getQuizHistory);

export default router;

