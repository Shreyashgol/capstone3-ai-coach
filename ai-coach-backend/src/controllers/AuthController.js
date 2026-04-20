import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/index.js';

class AuthController {
  static googleClient = null;

  static generateToken(userId) {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }

  static normalizeEmail(email) {
    return typeof email === 'string' ? email.trim().toLowerCase() : '';
  }

  static serializeUser(user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl
    };
  }

  static getGoogleClient() {
    if (!AuthController.googleClient) {
      AuthController.googleClient = new OAuth2Client();
    }

    return AuthController.googleClient;
  }

  static async register(req, res) {
    try {
      const { password, name } = req.body;
      const email = AuthController.normalizeEmail(req.body.email);

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

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Email already in use' 
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await UserModel.create({
        email,
        passwordHash,
        name,
        clerkUserId: '' // Will be set to user.id in model
      });

      const token = AuthController.generateToken(user.id);

      res.status(201).json({ 
        message: 'User registered successfully',
        token,
        user: AuthController.serializeUser(user)
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
      const { password } = req.body;
      const email = AuthController.normalizeEmail(req.body.email);

      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email and password are required' 
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ 
          error: 'Invalid credentials' 
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid credentials' 
        });
      }

      const token = AuthController.generateToken(user.id);

      res.json({ 
        message: 'Login successful',
        token,
        user: AuthController.serializeUser(user)
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Failed to login' 
      });
    }
  }

  static async googleAuth(req, res) {
    try {
      const { credential } = req.body;
      const googleClientId = process.env.GOOGLE_CLIENT_ID;

      if (!googleClientId) {
        return res.status(500).json({
          error: 'Google OAuth is not configured on the server'
        });
      }

      if (!credential) {
        return res.status(400).json({
          error: 'Google credential is required'
        });
      }

      const client = AuthController.getGoogleClient();
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId
      });

      const payload = ticket.getPayload();
      const email = AuthController.normalizeEmail(payload?.email);

      if (!payload || !email) {
        return res.status(400).json({
          error: 'Google account is missing a valid email address'
        });
      }

      if (!payload.email_verified) {
        return res.status(403).json({
          error: 'Please use a Google account with a verified email address'
        });
      }

      let user = await UserModel.findByEmail(email);
      let isNewUser = false;

      if (!user) {
        user = await UserModel.create({
          email,
          name: payload.name || email.split('@')[0],
          imageUrl: payload.picture || null,
          passwordHash: null,
          clerkUserId: ''
        });
        isNewUser = true;
      } else {
        const shouldUpdateName = !user.name && payload.name;
        const shouldUpdateImage = !user.imageUrl && payload.picture;

        if (shouldUpdateName || shouldUpdateImage) {
          user = await UserModel.update(user.id, {
            ...(shouldUpdateName ? { name: payload.name } : {}),
            ...(shouldUpdateImage ? { imageUrl: payload.picture } : {})
          });
        }
      }

      const token = AuthController.generateToken(user.id);

      res.json({
        message: isNewUser ? 'Google signup successful' : 'Google login successful',
        token,
        user: AuthController.serializeUser(user),
        isNewUser
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(401).json({
        error: 'Google authentication failed'
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
