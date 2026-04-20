# crekAI - AI Career Coach Platform

AI-powered career coaching app with a React frontend and an Express/Prisma backend.

## Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- AI: Google Generative AI
- Auth: JWT

## Project Structure

```text
crekAI/
├── ai-coach-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── ai-coach-backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── API_ENDPOINTS.md
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- Google AI API key

### Backend

```bash
cd ai-coach-backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Backend runs on `http://localhost:4001` by default.

### Frontend

```bash
cd ai-coach-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Environment Variables

Backend example:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_coach_db"
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="replace_with_a_secure_random_secret"
CORS_ORIGINS="https://your-frontend-domain.com"
NODE_ENV="development"
PORT=4001
```

Frontend local development:

```env
VITE_API_URL="http://localhost:4001"
```

## Deployment

This repository has been cleaned of old provider-specific deployment config so you can deploy it from scratch on your preferred platform.

Required backend environment variables:

- `DATABASE_URL`
- `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`
- `JWT_SECRET`
- `NODE_ENV`
- `PORT`
- `CORS_ORIGINS` for your deployed frontend origin

Required frontend environment variables:

- `VITE_API_URL`

## API Overview

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Resume:

```text
GET  /api/resume
POST /api/resume/save
POST /api/resume/improve
```

Cover letters:

```text
GET    /api/cover-letters
POST   /api/cover-letters/generate
PUT    /api/cover-letters/:id
DELETE /api/cover-letters/:id
```

Interview:

```text
POST /api/interview/generate-quiz
POST /api/interview/save-result
GET  /api/interview/assessments
```

Dashboard:

```text
GET /api/dashboard/stats
GET /api/dashboard/insights/:industry
```

See [API_ENDPOINTS.md](/Users/shreyashgolhani/Desktop/abc/capstone3-ai-coach/API_ENDPOINTS.md) for detailed endpoint docs.
- Ensure all tests pass before PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

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
