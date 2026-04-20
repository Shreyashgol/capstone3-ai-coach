import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/google', AuthController.googleAuth);
router.get('/me', AuthController.getMe);
router.post('/logout', AuthController.logout);
router.post('/sync', AuthController.syncUser);

export default router;
