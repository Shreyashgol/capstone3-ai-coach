# 📋 Deployment Checklist - AI Coach Platform

Use this checklist to ensure a smooth deployment to Render.com.

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed and pushed to GitHub
- [ ] No sensitive data (API keys, passwords) in code
- [ ] Environment files (.env) are in .gitignore
- [ ] Build scripts work locally (`npm run build` in both directories)

### 2. API Keys & Secrets
- [ ] Google Gemini API key obtained from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] JWT secret generated (32+ characters)
- [ ] Database connection string ready (from Render PostgreSQL)

### 3. Configuration Files
- [ ] Frontend environment variables configured
- [ ] Backend CORS settings updated for production
- [ ] Health check endpoint working (`/health`)

## 🚀 Deployment Steps

### Step 1: Database Setup (Neon)
- [x] PostgreSQL database created on Neon
- [ ] Note down the Neon connection string
- [ ] Database is accessible and running
- [ ] SSL mode is enabled (required for Neon)

### Step 2: Backend Deployment
- [ ] Create Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure build and start commands
- [ ] Add all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL=[PostgreSQL URL]`
  - [ ] `JWT_SECRET=[Generated Secret]`
  - [ ] `GEMINI_API_KEY=[Your API Key]`
  - [ ] `PORT=10000`
- [ ] Deploy and verify health check works

### Step 3: Frontend Deployment (Vercel)
- [ ] Sign in to Vercel with GitHub
- [ ] Import GitHub repository
- [ ] Configure root directory: `ai-coach-frontend`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=[Backend URL]`
- [ ] Deploy and verify site loads
- [ ] Custom domain setup (optional)

## 🔍 Post-Deployment Verification

### Backend Verification
- [ ] Health check responds: `https://[backend-url]/health`
- [ ] API endpoints are accessible
- [ ] Database connection working
- [ ] CORS allows frontend domain

### Frontend Verification
- [ ] Site loads without errors
- [ ] Can connect to backend API
- [ ] User registration works
- [ ] Cover letter generation works
- [ ] Interview quiz works
- [ ] Industry insights load

### Full Integration Test
- [ ] Register a new user account
- [ ] Complete onboarding process
- [ ] Generate a cover letter
- [ ] Take an interview quiz
- [ ] View industry insights dashboard
- [ ] Check that data persists

## 🛠 Troubleshooting

### Common Issues & Solutions

#### Backend Issues:
- **Build fails**: Check Node.js version and dependencies
- **Health check fails**: Verify database connection and environment variables
- **API errors**: Check CORS configuration and JWT secret

#### Frontend Issues:
- **Build fails**: Check Vite configuration and dependencies
- **Can't connect to API**: Verify VITE_API_URL is correct
- **Blank page**: Check browser console for errors

#### Database Issues:
- **Connection fails**: Verify DATABASE_URL format and credentials
- **Migrations fail**: Check Prisma schema and migration files

## 📊 Performance Optimization

### Free Tier Considerations:
- [ ] Backend may sleep after 15 minutes (first request will be slow)
- [ ] Database has connection limits
- [ ] Monitor usage to avoid hitting limits

### Optimization Tips:
- [ ] Enable gzip compression
- [ ] Optimize images and assets
- [ ] Use CDN for static assets (if needed)
- [ ] Monitor response times

## 🔐 Security Checklist

- [ ] All API keys are in environment variables
- [ ] JWT secret is secure and not exposed
- [ ] CORS is configured for production domains only
- [ ] Database credentials are secure
- [ ] No sensitive data in client-side code

## 📈 Monitoring & Maintenance

### Set Up Monitoring:
- [ ] Monitor backend health endpoint
- [ ] Set up error tracking (optional)
- [ ] Monitor database performance
- [ ] Track user registration and usage

### Regular Maintenance:
- [ ] Update dependencies regularly
- [ ] Monitor API usage limits
- [ ] Backup database (if needed)
- [ ] Review and rotate API keys

## 🎉 Success Criteria

Your deployment is successful when:
- [ ] Both frontend and backend are accessible via HTTPS
- [ ] Users can register and log in
- [ ] All main features work (cover letters, interviews, insights)
- [ ] Data persists between sessions
- [ ] No console errors in browser
- [ ] Health checks pass

## 📞 Support Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **GitHub Repository**: [Your repo URL]
- **Google Gemini API**: [ai.google.dev](https://ai.google.dev)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)

---

**Deployment URLs:**
- Frontend: `https://ai-coach-frontend.onrender.com`
- Backend: `https://ai-coach-backend.onrender.com`
- Health Check: `https://ai-coach-backend.onrender.com/health`

Good luck with your deployment! 🚀