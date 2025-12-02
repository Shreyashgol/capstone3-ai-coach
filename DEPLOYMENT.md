# 🚀 Deployment Guide - AI Coach Platform

This guide will help you deploy the AI Coach platform to Render.com with manual service creation.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Google Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🔧 Step-by-Step Deployment

### 1. Create PostgreSQL Database

1. Log in to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `ai-coach-db`
   - **Database**: `ai_coach`
   - **User**: `ai_coach_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click "Create Database"
5. **Save the connection details** - you'll need the External Database URL

### 2. Deploy Backend Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-coach-backend`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `ai-coach-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=[Your PostgreSQL External Database URL]
   JWT_SECRET=[Generate a random 32+ character string]
   GEMINI_API_KEY=[Your Google Gemini API Key]
   PORT=10000
   ```

5. Click "Create Web Service"

### 3. Deploy Frontend Service

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-coach-frontend`
   - **Branch**: `main`
   - **Root Directory**: `ai-coach-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://ai-coach-backend.onrender.com
   ```
   (Replace with your actual backend URL once deployed)

5. Click "Create Static Site"

### 4. Manual Setup Steps

#### Get Required API Keys:

1. **Google Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **JWT Secret**:
   - Generate a secure random string (32+ characters)
   - You can use: `openssl rand -base64 32`

#### Update Environment Variables:

1. Go to your backend service in Render
2. Navigate to "Environment" tab
3. Add all the environment variables listed above
4. Click "Save Changes" (this will trigger a redeploy)

### 4. Service URLs

After deployment, you'll get these URLs:
- **Backend API**: `https://ai-coach-backend.onrender.com`
- **Frontend App**: `https://ai-coach-frontend.onrender.com`
- **Database**: Internal PostgreSQL (managed by Render)

## 🔍 Verification Steps

### 1. Check Backend Health
Visit: `https://ai-coach-backend.onrender.com/health`

Expected response:
```json
{
  "ok": true,
  "database": "connected"
}
```

### 2. Test Frontend
Visit: `https://ai-coach-frontend.onrender.com`

You should see the AI Coach landing page.

### 3. Test API Integration
- Try registering a new user
- Generate a cover letter
- Take an interview quiz
- Check industry insights

## 🛠 Troubleshooting

### Common Issues:

1. **Backend fails to start**:
   - Check if `GEMINI_API_KEY` is set correctly
   - Verify database connection in logs
   - Check build logs for dependency issues

2. **Frontend can't connect to backend**:
   - Verify `VITE_API_URL` points to correct backend URL
   - Check CORS configuration in backend
   - Ensure backend is running and healthy

3. **Database connection issues**:
   - Check if PostgreSQL service is running
   - Verify `DATABASE_URL` is correctly set
   - Check Prisma migrations in build logs

### Debug Commands:

```bash
# Check backend logs
# Go to Render dashboard → Backend service → Logs

# Check frontend build logs  
# Go to Render dashboard → Frontend service → Logs

# Test API endpoints manually
curl https://ai-coach-backend.onrender.com/health
```

## 📊 Monitoring

### Health Checks:
- Backend: `/health` endpoint
- Database connectivity is tested in health check
- Frontend: Static site availability

### Performance:
- Free tier limitations: 
  - Backend may sleep after 15 minutes of inactivity
  - Database has connection limits
  - Build time limits apply

## 🔄 Updates and Redeployment

### Automatic Deployment:
- Push to `main` branch triggers automatic redeployment
- Both frontend and backend will rebuild

### Manual Deployment:
1. Go to Render dashboard
2. Select the service
3. Click "Manual Deploy" → "Deploy latest commit"

## 🔐 Security Considerations

### Environment Variables:
- Never commit `.env` files to Git
- Use Render's environment variable management
- Rotate API keys regularly

### CORS Configuration:
- Backend is configured for production domains
- Update CORS origins if using custom domains

## 📈 Scaling

### Free Tier Limits:
- 750 hours/month compute time
- 1GB RAM per service
- 100GB bandwidth/month

### Upgrade Options:
- Paid plans offer:
  - Always-on services (no sleeping)
  - More RAM and CPU
  - Custom domains
  - Advanced monitoring

## 🆘 Support

If you encounter issues:

1. **Check Render Status**: [status.render.com](https://status.render.com)
2. **Review Logs**: Service logs in Render dashboard
3. **GitHub Issues**: Create an issue in the repository
4. **Render Docs**: [render.com/docs](https://render.com/docs)

## 🎉 Success!

Once deployed successfully, your AI Coach platform will be live and accessible to users worldwide!

**Frontend URL**: `https://ai-coach-frontend.onrender.com`
**Backend API**: `https://ai-coach-backend.onrender.com`

Share your deployed application and start helping users with their career development! 🚀