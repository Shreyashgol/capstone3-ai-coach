# crekAI - AI Career Coach Platform

**An intelligent career coaching platform that leverages AI technology to provide personalized career guidance, helping users land their dream jobs through optimized resumes, cover letters, and interview preparation.**

## Features

### **Core Capabilities**
- **AI-Powered Resume Builder** - Create ATS-optimized resumes with real-time scoring
- **Smart Cover Letter Generation** - Generate personalized cover letters for specific jobs
- **Interview Preparation** - Practice with AI-generated questions and get instant feedback
- **Industry Insights** - Get real-time market data, salary trends, and skill recommendations
- **Career Dashboard** - Track your progress and get personalized recommendations

### **Technical Features**
- **Full-Stack Architecture** - React frontend + Node.js/Express backend
- **Real-time AI Integration** - Google Generative AI (Gemini 1.5 Flash)
- **Advanced Search & Filtering** - Find and organize your career documents
- **Secure Authentication** - JWT-based authentication with Clerk
- **Responsive Design** - Works seamlessly on desktop and mobile
- **RESTful API** - Clean, documented API endpoints

## Architecture

### Backend Stack
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Clerk integration
- **AI Integration**: Google Generative AI
- **Deployment**: Render (Free tier ready)

### Frontend Stack
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **HTTP Client**: Axios
- **Authentication**: Clerk React SDK

## Project Structure

```
crekAI/
├── ai-coach-backend/          # Node.js/Express API
│   ├── src/
│   │   ├── routes/           # API route handlers
│   │   ├── middleware/       # Auth and validation middleware
│   │   ├── controllers/      # Business logic
│   │   └── db/              # Database configuration
│   ├── prisma/              # Database schema and migrations
│   ├── render.yaml          # Render deployment config
│   └── package.json
├── ai-coach-frontend/        # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   └── package.json
└── # AI Coach - Career Development Platform

A comprehensive AI-powered career development platform that helps users with resume building, cover letter generation, interview preparation, and industry insights.

## 🚀 Features

- **Industry Insights Dashboard**: Real-time data for tech roles with salary trends in Indian market (INR)
- **Interview Preparation**: AI-powered quiz generation with role-specific questions
- **Cover Letter Generator**: AI-generated personalized cover letters
- **Resume Builder**: Professional resume creation and optimization
- **Learning Plans**: Personalized todo lists based on quiz performance

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Radix UI** components
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Prisma** ORM with PostgreSQL
- **JWT** authentication
- **Google Gemini AI** for content generation
- **Inngest** for background jobs

## 📦 Project Structure

```
ai-coach/
├── ai-coach-frontend/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── contexts/          # React contexts
│   │   └── config/            # Configuration files
│   └── package.json
├── ai-coach-backend/           # Node.js backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── middleware/       # Express middleware
│   └── package.json
└── render.yaml                # Render deployment config
```

## 🚀 Deployment

This project is configured for deployment on Render.com with the following services:

### Backend (Web Service)
- **Runtime**: Node.js
- **Build Command**: `cd ai-coach-backend && npm install && npm run build`
- **Start Command**: `cd ai-coach-backend && npm start`
- **Environment Variables**:
  - `NODE_ENV=production`
  - `DATABASE_URL` (from Render PostgreSQL)
  - `JWT_SECRET` (auto-generated)
  - `GEMINI_API_KEY` (manual setup required)

### Frontend (Static Site)
- **Build Command**: `cd ai-coach-frontend && npm install && npm run build`
- **Publish Directory**: `ai-coach-frontend/dist`
- **Environment Variables**:
  - `VITE_API_URL=https://ai-coach-backend.onrender.com`

### Database
- **PostgreSQL** database on Render's free tier

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-coach
```

2. **Backend Setup**
```bash
cd ai-coach-backend
npm install
cp .env.example .env
# Edit .env with your database URL and API keys
npx prisma migrate dev
npm run dev
```

3. **Frontend Setup**
```bash
cd ai-coach-frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```
DATABASE_URL="postgresql://username:password@localhost:5432/ai_coach"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"
NODE_ENV="development"
```

**Frontend (.env.development)**
```
VITE_API_URL="http://localhost:4001"
```

## 📊 Key Features

### Industry Insights
- Real-time job market data for Indian tech industry
- Salary ranges in INR (Lakhs per annum)
- Geographic insights for major tech hubs
- Skills demand analysis with growth trends

### Interview Preparation
- Role-specific quiz generation
- AI-powered dynamic questions for repeat attempts
- Detailed performance analysis
- Personalized learning recommendations

### Cover Letters & Resume
- AI-generated content based on job descriptions
- Professional templates and formatting
- ATS optimization scoring
- PDF export functionality

## 🔐 Authentication

The platform uses JWT-based authentication with the following endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop browsers
- Tablet devices
- Mobile phones
- Dark/Light mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Render's free PostgreSQL)
- Google AI API key
- Clerk authentication setup

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/crekAI.git
cd crekAI/ai-coach-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start development server**
```bash
npm run dev
```

Backend will be running on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../ai-coach-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API URLs and Clerk keys
```

4. **Start development server**
```bash
npm run dev
```

Frontend will be running on `http://localhost:5173`

## Deployment

### Backend (Render)
The backend is pre-configured for Render deployment:

1. **Push your code to GitHub**
2. **Connect your repository to Render**
3. **Render will automatically detect the `render.yaml` configuration**
4. **Set environment variables in Render dashboard**

**Required Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_AI_API_KEY` - Google Generative AI API key
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Set to `production`

### Frontend (Vercel)
Deploy the frontend to your preferred static hosting:

1. **Push code to GitHub**
2. **Connect repository to Vercel or Netlify**
3. **Configure build command**: `npm run build`
4. **Set environment variables**

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login      - User login
POST /api/auth/register   - User registration
GET  /api/auth/me         - Get current user
POST /api/auth/logout     - User logout
```

### Resume Management
```
GET    /api/resume              - Get user resume
POST   /api/resume/save         - Save/update resume
POST   /api/resume/improve      - AI-powered improvements
GET    /api/resume/ats-score    - Get ATS score
```

### Cover Letters
```
GET    /api/cover-letters       - Get all cover letters
POST   /api/cover-letters/generate - Generate new cover letter
PUT    /api/cover-letters/:id   - Update cover letter
DELETE /api/cover-letters/:id   - Delete cover letter
```

### Interview Preparation
```
POST   /api/interview/generate-quiz    - Generate interview questions
POST   /api/interview/save-result      - Save assessment results
GET    /api/interview/assessments      - Get user assessments
```

### Dashboard & Insights
```
GET    /api/dashboard/stats            - Get user statistics
GET    /api/dashboard/insights/:industry - Get industry insights
```

## Testing

### Backend Tests
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

### Frontend Tests
```bash
# Run component tests
npm test

# Run E2E tests
npm run test:e2e
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - User profiles and authentication
- **Resumes** - Resume content and ATS scoring
- **CoverLetters** - Generated cover letters
- **Assessments** - Interview practice results
- **IndustryInsights** - Market data and trends

See `ai-coach-backend/prisma/schema.prisma` for complete schema.

## Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## Roadmap

### Version 1.0 (Current)
- Basic resume builder
- Cover letter generation
- Interview preparation
- User authentication
- Industry insights

### Version 1.1 (Planned)
- Real-time collaboration
- Advanced analytics
- Mobile app
- Integration with LinkedIn
- Company reviews

### Version 2.0 (Future)
- AI career path planning
- Salary negotiation coach
- Network analysis
- Skill gap assessment
- Mentorship matching

## Performance

- **API Response Time**: <200ms (95th percentile)
- **Page Load Time**: <3 seconds
- **Uptime**: 99.9% (with proper hosting)
- **Database**: Optimized queries with proper indexing

## Security

- JWT-based authentication with refresh tokens
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure file upload handling
- CORS configuration
- Rate limiting

---

**Built with ❤️ by the crekAI Team**

*Empowering careers through AI technology*
