# 📡 AI Coach - API Endpoints Documentation

## Base URL
- **Production**: `https://your-api-domain.com`
- **Development**: `http://localhost:4001`

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints
**Base Path**: `/api/auth`

### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user account
- **Authentication**: Not required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```
- **Response** (201):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login with existing credentials
- **Authentication**: Not required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response** (200):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 3. Google OAuth Login / Signup
- **Endpoint**: `POST /api/auth/google`
- **Description**: Login or sign up with a Google credential and receive the app JWT
- **Authentication**: Not required
- **Request Body**:
```json
{
  "credential": "google_id_token"
}
```
- **Response** (200):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "imageUrl": "https://example.com/avatar.jpg"
  },
  "isNewUser": true
}
```

### 4. Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Description**: Get currently authenticated user details
- **Authentication**: Required
- **Response** (200):
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "industry": "Software Development",
    "theme": "dark"
  }
}
```

### 5. Logout User
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logout current user
- **Authentication**: Required
- **Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

### 6. Sync User Data
- **Endpoint**: `POST /api/auth/sync`
- **Description**: Sync user data from external auth provider
- **Authentication**: Required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "imageUrl": "https://example.com/avatar.jpg"
}
```
- **Response** (200):
```json
{
  "user": { /* user object */ }
}
```

---

## 👤 User Endpoints
**Base Path**: `/api/user`

### 1. Get Onboarding Status
- **Endpoint**: `GET /api/user/onboarding-status`
- **Description**: Check if user has completed onboarding
- **Authentication**: Required
- **Response** (200):
```json
{
  "isOnboarded": true
}
```

### 2. Update User Profile
- **Endpoint**: `POST /api/user/update`
- **Description**: Update user profile information
- **Authentication**: Required
- **Request Body**:
```json
{
  "industry": "Software Development",
  "experience": 5,
  "bio": "Full-stack developer with 5 years experience",
  "skills": ["JavaScript", "React", "Node.js"]
}
```
- **Response** (200):
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "industry": "Software Development",
  "experience": 5,
  "bio": "Full-stack developer...",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### 3. Get User Preferences
- **Endpoint**: `GET /api/user/preferences`
- **Description**: Get user preferences (theme, etc.)
- **Authentication**: Required
- **Response** (200):
```json
{
  "theme": "dark"
}
```

### 4. Update User Preferences
- **Endpoint**: `PUT /api/user/preferences`
- **Description**: Update user preferences
- **Authentication**: Required
- **Request Body**:
```json
{
  "theme": "light"
}
```
- **Response** (200):
```json
{
  "theme": "light",
  "message": "Theme preference updated"
}
```

---

## 📄 Resume Endpoints
**Base Path**: `/api/resume`

### 1. Get Resume
- **Endpoint**: `GET /api/resume`
- **Description**: Get user's resume
- **Authentication**: Required
- **Response** (200):
```json
{
  "id": "resume_id",
  "userId": "user_id",
  "content": "Resume content here...",
  "atsScore": 85.5,
  "feedback": "Your resume is well-structured...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Save Resume
- **Endpoint**: `POST /api/resume/save`
- **Description**: Save or update resume content
- **Authentication**: Required
- **Request Body**:
```json
{
  "content": "Full resume content here..."
}
```
- **Response** (200):
```json
{
  "message": "Resume saved successfully",
  "resume": { /* resume object */ },
  "success": true
}
```

### 3. Improve Resume Content
- **Endpoint**: `POST /api/resume/improve`
- **Description**: Use AI to improve resume content
- **Authentication**: Required
- **Request Body**:
```json
{
  "current": "Current text to improve...",
  "type": "summary" // or "experience", "skills", etc.
}
```
- **Response** (200):
```json
{
  "improved": "Improved text here...",
  "success": true,
  "message": "Text improved successfully"
}
```

### 4. Get ATS Score
- **Endpoint**: `GET /api/resume/ats-score`
- **Description**: Analyze resume and get ATS score
- **Authentication**: Required
- **Response** (200):
```json
{
  "atsScore": 85.5,
  "feedback": "Your resume is well-structured...",
  "strengths": [
    "Clear formatting",
    "Relevant keywords",
    "Quantified achievements"
  ],
  "improvements": [
    "Add more technical skills",
    "Include certifications"
  ],
  "success": true,
  "message": "ATS analysis completed successfully"
}
```

### 5. Download Resume PDF
- **Endpoint**: `GET /api/resume/pdf`
- **Description**: Download resume as PDF
- **Authentication**: Required
- **Response**: PDF file download

---

## 📝 Cover Letter Endpoints
**Base Path**: `/api/cover-letters`

### 1. Get All Cover Letters
- **Endpoint**: `GET /api/cover-letters`
- **Description**: Get all cover letters for user
- **Authentication**: Required
- **Response** (200):
```json
[
  {
    "id": "cover_letter_id",
    "userId": "user_id",
    "content": "Cover letter content...",
    "jobTitle": "Software Engineer",
    "companyName": "Tech Corp",
    "jobDescription": "Job description...",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get Cover Letter by ID
- **Endpoint**: `GET /api/cover-letters/:id`
- **Description**: Get specific cover letter
- **Authentication**: Required
- **Response** (200):
```json
{
  "id": "cover_letter_id",
  "content": "Cover letter content...",
  "jobTitle": "Software Engineer",
  "companyName": "Tech Corp"
}
```

### 3. Generate Cover Letter with AI
- **Endpoint**: `POST /api/cover-letters/generate`
- **Description**: Generate cover letter using AI
- **Authentication**: Required
- **Request Body**:
```json
{
  "jobTitle": "Software Engineer",
  "companyName": "Tech Corp",
  "jobDescription": "We are looking for...",
  "resumeContent": "Your resume content..."
}
```
- **Response** (200):
```json
{
  "coverLetter": {
    "id": "cover_letter_id",
    "content": "Generated cover letter...",
    "jobTitle": "Software Engineer",
    "companyName": "Tech Corp"
  }
}
```

### 4. Create Cover Letter Manually
- **Endpoint**: `POST /api/cover-letters`
- **Description**: Create cover letter manually
- **Authentication**: Required
- **Request Body**:
```json
{
  "content": "Cover letter content...",
  "jobTitle": "Software Engineer",
  "companyName": "Tech Corp",
  "jobDescription": "Job description..."
}
```
- **Response** (201):
```json
{
  "coverLetter": { /* cover letter object */ }
}
```

### 5. Update Cover Letter
- **Endpoint**: `PUT /api/cover-letters/:id`
- **Description**: Update existing cover letter
- **Authentication**: Required
- **Request Body**:
```json
{
  "content": "Updated content...",
  "jobTitle": "Senior Software Engineer"
}
```
- **Response** (200):
```json
{
  "coverLetter": { /* updated cover letter */ }
}
```

### 6. Update Cover Letter Status
- **Endpoint**: `PATCH /api/cover-letters/:id/status`
- **Description**: Update cover letter status
- **Authentication**: Required
- **Request Body**:
```json
{
  "status": "sent" // or "draft", "archived"
}
```
- **Response** (200):
```json
{
  "coverLetter": { /* updated cover letter */ }
}
```

### 7. Delete Cover Letter
- **Endpoint**: `DELETE /api/cover-letters/:id`
- **Description**: Delete cover letter
- **Authentication**: Required
- **Response** (200):
```json
{
  "message": "Cover letter deleted successfully"
}
```

### 8. Test Endpoint
- **Endpoint**: `GET /api/cover-letters/test`
- **Description**: Test if cover letter routes are working
- **Authentication**: Not required
- **Response** (200):
```json
{
  "message": "Cover letter routes working",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎯 Interview Endpoints
**Base Path**: `/api/interview`

### 1. Generate Quiz
- **Endpoint**: `POST /api/interview/generate-quiz`
- **Description**: Generate interview quiz questions
- **Authentication**: Required
- **Request Body**:
```json
{
  "category": "JavaScript",
  "difficulty": "intermediate",
  "count": 10
}
```
- **Response** (200):
```json
{
  "questions": [
    {
      "id": 1,
      "question": "What is closure in JavaScript?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}
```

### 2. Save Quiz Result
- **Endpoint**: `POST /api/interview/save-result`
- **Description**: Save quiz assessment result
- **Authentication**: Required
- **Request Body**:
```json
{
  "category": "JavaScript",
  "quizScore": 85.5,
  "questions": [ /* quiz questions and answers */ ],
  "improvementTip": "Focus on async/await..."
}
```
- **Response** (200):
```json
{
  "assessment": {
    "id": "assessment_id",
    "quizScore": 85.5,
    "category": "JavaScript"
  }
}
```

### 3. Get All Assessments
- **Endpoint**: `GET /api/interview/assessments`
- **Description**: Get all user assessments
- **Authentication**: Required
- **Response** (200):
```json
[
  {
    "id": "assessment_id",
    "category": "JavaScript",
    "quizScore": 85.5,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4. Get Assessment by ID
- **Endpoint**: `GET /api/interview/assessments/:id`
- **Description**: Get specific assessment
- **Authentication**: Required
- **Response** (200):
```json
{
  "id": "assessment_id",
  "category": "JavaScript",
  "quizScore": 85.5,
  "questions": [ /* questions */ ],
  "improvementTip": "Focus on..."
}
```

### 5. Delete Assessment
- **Endpoint**: `DELETE /api/interview/assessments/:id`
- **Description**: Delete assessment
- **Authentication**: Required
- **Response** (200):
```json
{
  "message": "Assessment deleted successfully"
}
```

### 6. Get Todos
- **Endpoint**: `GET /api/interview/todos`
- **Description**: Get interview preparation todos
- **Authentication**: Required
- **Response** (200):
```json
[
  {
    "id": "todo_id",
    "title": "Practice coding problems",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 7. Mark Todo Complete
- **Endpoint**: `PATCH /api/interview/todos/:id/complete`
- **Description**: Mark todo as complete
- **Authentication**: Required
- **Response** (200):
```json
{
  "todo": {
    "id": "todo_id",
    "completed": true
  }
}
```

### 8. Delete Todo
- **Endpoint**: `DELETE /api/interview/todos/:id`
- **Description**: Delete todo
- **Authentication**: Required
- **Response** (200):
```json
{
  "message": "Todo deleted successfully"
}
```

### 9. Get Quiz History
- **Endpoint**: `GET /api/interview/quiz-history`
- **Description**: Get quiz history
- **Authentication**: Required
- **Response** (200):
```json
[
  {
    "id": "quiz_id",
    "category": "JavaScript",
    "score": 85.5,
    "completedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 📊 Dashboard Endpoints
**Base Path**: `/api/dashboard`

### 1. Get Industry Insights
- **Endpoint**: `GET /api/dashboard/insights`
- **Description**: Get insights for user's industry
- **Authentication**: Required
- **Response** (200):
```json
{
  "industry": "Software Development",
  "salaryRanges": [
    {
      "role": "Junior Developer",
      "min": 50000,
      "max": 80000,
      "median": 65000
    }
  ],
  "growthRate": 15.5,
  "demandLevel": "High",
  "topSkills": ["JavaScript", "React", "Node.js"],
  "marketOutlook": "Strong growth expected...",
  "keyTrends": ["AI Integration", "Remote Work"],
  "recommendedSkills": ["TypeScript", "Docker"]
}
```

### 2. Refresh Industry Insights
- **Endpoint**: `POST /api/dashboard/insights/refresh`
- **Description**: Refresh industry insights data
- **Authentication**: Required
- **Response** (200):
```json
{
  "message": "Insights refreshed successfully",
  "insights": { /* updated insights */ }
}
```

### 3. Get Dashboard Stats
- **Endpoint**: `GET /api/dashboard/stats`
- **Description**: Get dashboard statistics
- **Authentication**: Required
- **Response** (200):
```json
{
  "totalResumes": 1,
  "totalCoverLetters": 5,
  "totalAssessments": 10,
  "averageScore": 85.5,
  "completedTodos": 8,
  "totalTodos": 10
}
```

### 4. Get Job Categories
- **Endpoint**: `GET /api/dashboard/job-categories`
- **Description**: Get job category insights
- **Authentication**: Required
- **Response** (200):
```json
{
  "jobCategories": [
    {
      "category": "Software Engineer",
      "currentJobs": 15000,
      "growthRate": 12.5,
      "growthTrend": "up",
      "demandLevel": "Very High",
      "remoteWorkPercentage": 75,
      "topSkills": ["JavaScript", "Python", "React"],
      "skillsToLearn": ["TypeScript", "Docker", "Kubernetes"],
      "salaryRanges": [
        {
          "role": "Junior",
          "min": 60000,
          "max": 90000,
          "median": 75000
        }
      ],
      "marketOutlook": "Strong demand continues..."
    }
  ]
}
```

### 5. Get Salary Trends
- **Endpoint**: `GET /api/dashboard/salary-trends`
- **Description**: Get salary trends for job category
- **Authentication**: Required
- **Query Parameters**: `?category=Software Engineer`
- **Response** (200):
```json
{
  "category": "Software Engineer",
  "trends": [
    {
      "month": "Jan 2024",
      "junior": 65000,
      "midLevel": 95000,
      "senior": 135000,
      "lead": 165000,
      "jobOpenings": 1200,
      "demandIndex": 85
    }
  ]
}
```

### 6. Get Market Insights
- **Endpoint**: `GET /api/dashboard/market-insights`
- **Description**: Get comprehensive market insights
- **Authentication**: Required
- **Response** (200):
```json
{
  "marketOverview": {
    "totalJobs": 125000,
    "weeklyGrowth": 3.5,
    "avgSalary": 95000,
    "remotePercentage": 72
  },
  "skillDemand": {
    "hotSkills": [
      {
        "skill": "AI/ML",
        "demand": 95,
        "growth": "+45%"
      }
    ]
  },
  "industryTrends": [
    {
      "trend": "AI Integration",
      "impact": "High",
      "description": "Companies adopting AI...",
      "timeframe": "2024-2025"
    }
  ],
  "companyInsights": {
    "hiringMost": ["Google", "Microsoft", "Amazon"],
    "fastestGrowing": ["OpenAI", "Anthropic"],
    "remoteFirst": ["GitLab", "Automattic"]
  },
  "geographicInsights": [
    {
      "location": "San Francisco",
      "avgSalary": 145000,
      "jobCount": 8500,
      "growth": "+5.2%"
    }
  ]
}
```

### 7. Get Skill Analytics
- **Endpoint**: `GET /api/dashboard/skill-analytics`
- **Description**: Get skill analytics and learning paths
- **Authentication**: Required
- **Query Parameters**: `?category=Software Engineer`
- **Response** (200):
```json
{
  "category": "Software Engineer",
  "skillGaps": [
    {
      "skill": "JavaScript",
      "currentLevel": 80,
      "requiredLevel": 90
    }
  ],
  "learningPaths": [
    {
      "skill": "TypeScript",
      "priority": "High",
      "estimatedTime": "2 months",
      "resources": ["Course A", "Book B"]
    }
  ]
}
```

---

## 🔧 System Endpoints

### Health Check
- **Endpoint**: `GET /`
- **Description**: Check API health and get endpoint list
- **Authentication**: Not required
- **Response** (200):
```json
{
  "message": "🚀 AI Coach Backend API",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth/*",
    "coverLetters": "/api/cover-letters/*",
    "interview": "/api/interview/*",
    "user": "/api/user/*",
    "resume": "/api/resume/*",
    "dashboard": "/api/dashboard/*"
  }
}
```

---

## 📋 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Specific error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## 🔑 Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Receive Token**: Store JWT token from response
3. **Use Token**: Include in Authorization header for all requests
4. **Refresh**: Token expires after 7 days, login again

### Example Request with Authentication
```bash
curl -X GET https://your-api-domain.com/api/user/preferences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## 📊 Rate Limits

- **General**: 100 requests per minute per IP
- **AI Endpoints**: 10 requests per minute per user
  - `/api/resume/improve`
  - `/api/resume/ats-score`
  - `/api/cover-letters/generate`
  - `/api/interview/generate-quiz`

---

## 🌐 CORS Configuration

Allowed origins are configured by the backend at runtime:
- `http://localhost:5173` (Development)
- `http://localhost:5174` (Development)
- `http://localhost:3000` (Development)
- `CORS_ORIGINS` environment variable (Production)

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All IDs are UUIDs or CUIDs
- File uploads are limited to 1MB
- Request bodies must be JSON
- Responses are always JSON

---

**Last Updated**: January 9, 2026
**API Version**: 1.0.0
**Documentation**: Complete ✅
