import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// POST /api/auth/login - User login
router.post('/login', AuthController.login);

// POST /api/auth/register - User registration  
router.post('/register', AuthController.register);

// GET /api/auth/me - Get current user
router.get('/me', AuthController.getMe);

// POST /api/auth/logout - User logout
router.post('/logout', AuthController.logout);

// POST /api/auth/sync - Sync user data (for frontend compatibility)
router.post('/sync', AuthController.syncUser);

export default router;

