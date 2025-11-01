import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index.js';

class AuthController {
  static generateToken(userId) {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }

  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({ 
          error: 'Email, password, and name are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          error: 'Password must be at least 6 characters long' 
        });
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Email already in use' 
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        email,
        passwordHash,
        name,
        clerkUserId: '' // Will be set to user.id in model
      });

      // Generate token
      const token = AuthController.generateToken(user.id);

      // Return user data without sensitive info
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl
      };

      res.status(201).json({ 
        message: 'User registered successfully',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: 'Failed to register user' 
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ 
          error: 'Invalid credentials' 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials' 
        });
      }

      // Generate token
      const token = AuthController.generateToken(user.id);

      // Return user data without sensitive info
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        imageUrl: user.imageUrl
      };

      res.json({ 
        message: 'Login successful',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Failed to login' 
      });
    }
  }

  static async getMe(req, res) {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      res.json({ 
        user 
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ 
        error: 'Failed to get user data' 
      });
    }
  }

  static async logout(req, res) {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return success
      res.json({ 
        message: 'Logout successful' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Failed to logout' 
      });
    }
  }

  static async syncUser(req, res) {
    try {
      const userId = req.userId;
      const { email, name, imageUrl } = req.body;

      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized' 
        });
      }

      const user = await UserModel.update(userId, {
        email,
        name,
        imageUrl
      });

      res.json({ 
        message: 'User synced successfully',
        user 
      });
    } catch (error) {
      console.error('Sync user error:', error);
      res.status(500).json({ 
        error: 'Failed to sync user' 
      });
    }
  }
}

export default AuthController;
