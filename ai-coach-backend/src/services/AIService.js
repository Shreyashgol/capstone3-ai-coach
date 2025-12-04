import { GoogleGenerativeAI } from '@google/generative-ai';
import { IndustryInsightModel } from '../models/index.js';

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateIndustryInsights(industry) {
    try {
      const prompt = `
        Generate comprehensive industry insights for "${industry}" industry.
        Return a JSON object with the following structure:
        {
          "salaryRanges": [
            { "role": "Junior Developer", "min": 60000, "max": 80000, "currency": "USD" },
            { "role": "Senior Developer", "min": 80000, "max": 120000, "currency": "USD" },
            { "role": "Lead Developer", "min": 120000, "max": 160000, "currency": "USD" }
          ],
          "growthRate": 8.5,
          "demandLevel": "High",
          "topSkills": ["JavaScript", "Python", "React", "Node.js", "AWS"],
          "marketOutlook": "Positive growth expected with increasing demand for digital transformation",
          "keyTrends": ["Remote work", "AI integration", "Cloud migration", "DevOps practices"],
          "recommendedSkills": ["Machine Learning", "Kubernetes", "GraphQL", "TypeScript"]
        }
        
        Make the data realistic and current for ${industry}. Use realistic salary ranges and growth rates.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      const insights = JSON.parse(jsonMatch[0]);
      
      // Calculate next update date (7 days from now)
      const nextUpdate = new Date();
      nextUpdate.setDate(nextUpdate.getDate() + 7);
      
      return {
        ...insights,
        industry,
        lastUpdated: new Date(),
        nextUpdate
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Return fallback data if AI fails
      return {
        industry,
        salaryRanges: [
          { role: "Entry Level", min: 50000, max: 70000, currency: "USD" },
          { role: "Mid Level", min: 70000, max: 100000, currency: "USD" },
          { role: "Senior Level", min: 100000, max: 150000, currency: "USD" }
        ],
        growthRate: 7.0,
        demandLevel: "Medium",
        topSkills: ["Communication", "Problem Solving", "Team Work"],
        marketOutlook: "Steady growth expected",
        keyTrends: ["Digital Transformation", "Remote Work"],
        recommendedSkills: ["Technical Skills", "Soft Skills"],
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };
    }
  }

  async generateResumeContent(resumeText, jobDescription = '') {
    try {
      const prompt = `
        Analyze and improve this resume. ${jobDescription ? `Tailor it for this job description: ${jobDescription}` : ''}
        
        Resume: ${resumeText}
        
        Provide:
        1. ATS score (0-100)
        2. Detailed feedback for improvement
        3. Improved resume content
        
        Return as JSON:
        {
          "atsScore": 85,
          "feedback": "Detailed feedback here...",
          "improvedContent": "Improved resume content here..."
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Resume AI Service Error:', error);
      
      return {
        atsScore: 75,
        feedback: "Resume analysis failed. Please review your resume manually for common issues like formatting, keywords, and clarity.",
        improvedContent: resumeText
      };
    }
  }

  async generateCoverLetter(resumeText, jobDescription, companyName, jobTitle) {
    try {
      const prompt = `
        Write a professional cover letter based on:
        
        Resume: ${resumeText}
        Job Description: ${jobDescription}
        Company: ${companyName}
        Position: ${jobTitle}
        
        Return as JSON:
        {
          "content": "Full cover letter content here..."
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Cover Letter AI Service Error:', error);
      
      return {
        content: `Dear Hiring Manager at ${companyName},\n\nI am writing to express my interest in the ${jobTitle} position. Based on my experience and skills, I believe I would be a valuable addition to your team.\n\nI look forward to discussing how my background aligns with your needs.\n\nSincerely,\n[Your Name]`
      };
    }
  }

  async generateInterviewQuestions(industry, experience = 'mid') {
    try {
      const prompt = `
        Generate 10 interview questions for ${experience} level ${industry} professionals.
        Include technical and behavioral questions.
        
        Return as JSON:
        {
          "questions": [
            {
              "question": "Question text here",
              "type": "technical|behavioral",
              "expectedAnswer": "What to look for in answer"
            }
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Interview AI Service Error:', error);
      
      return {
        questions: [
          {
            question: "Tell me about your experience in this industry",
            type: "behavioral",
            expectedAnswer: "Look for relevant experience and passion"
          },
          {
            question: "How do you handle challenges in your work?",
            type: "behavioral",
            expectedAnswer: "Look for problem-solving skills"
          }
        ]
      };
    }
  }

  async generateJobCategoryInsights(jobCategory) {
    try {
      const prompt = `
        Generate comprehensive job market insights for "${jobCategory}" role in 2025.
        
        Provide current market analysis including:
        - Growth rate percentage (realistic number between 5-25%)
        - Demand level (High/Very High/Medium)
        - Market outlook (2-3 sentences)
        - Key industry trends (4-6 current trends)
        - Remote work percentage
        - Average experience required
        
        Return as JSON:
        {
          "growthRate": 15.2,
          "demandLevel": "Very High",
          "marketOutlook": "Strong growth expected due to digital transformation and AI adoption. Companies are investing heavily in this role.",
          "keyTrends": ["AI Integration", "Remote-First Culture", "Cloud Migration", "Agile Methodologies"],
          "remoteWorkPercentage": 75,
          "avgExperienceRequired": "2-5 years"
        }
        
        Make the data realistic and current for ${jobCategory} in 2025.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      const insights = JSON.parse(jsonMatch[0]);
      
      return {
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };
    } catch (error) {
      console.error('Job Category AI Service Error:', error);
      
      // Return fallback data if AI fails
      return {
        growthRate: Math.floor(Math.random() * 15) + 8,
        demandLevel: 'High',
        marketOutlook: `${jobCategory} roles are in high demand with strong growth prospects in the current market.`,
        keyTrends: ['Digital Transformation', 'Remote Work', 'AI Integration', 'Agile Practices'],
        remoteWorkPercentage: Math.floor(Math.random() * 40) + 50,
        avgExperienceRequired: '2-4 years',
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
    }
  }

  async improveResumeContent(content, type, industry = 'general') {
    try {
      const prompt = `
        You are a professional resume writer and career coach.
        Improve the following section of a resume for a candidate in the "${industry}" industry.

        Section type: ${type}
        Industry: ${industry}

        Original section:
        """
        ${content}
        """

        Instructions:
        - Make the text more impactful and professional
        - Use action verbs and quantifiable achievements where possible
        - Optimize for ATS (Applicant Tracking System) compatibility
        - Keep the same general structure and meaning
        - Return ONLY the improved text, no explanations

        Improved section:
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        improved: text.trim(),
        success: true
      };
    } catch (error) {
      console.error('Resume Improvement AI Service Error:', error);
      
      return {
        improved: content, // Return original if AI fails
        success: false,
        error: error.message
      };
    }
  }

  async analyzeResumeATS(content) {
    try {
      const prompt = `
        You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer.
        
        Analyze this resume for ATS compatibility and provide a comprehensive assessment.
        
        Resume content:
        """
        ${content}
        """
        
        Provide a detailed analysis with:
        1. ATS score (0-100) based on formatting, keywords, structure
        2. Specific feedback on what works well and what needs improvement
        3. List of strengths (3-5 items)
        4. List of specific improvements needed (3-5 items)
        
        Return ONLY a valid JSON object in this exact format:
        {
          "atsScore": 85,
          "feedback": "Your resume shows strong technical skills and clear formatting. The experience section is well-structured with quantifiable achievements. However, consider adding more industry-specific keywords and improving the skills section organization.",
          "strengths": ["Clear formatting and structure", "Quantifiable achievements", "Relevant technical skills", "Professional summary"],
          "improvements": ["Add more industry keywords", "Improve skills section", "Include more metrics", "Optimize section headers"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Validate and sanitize
        analysis.atsScore = Math.max(0, Math.min(100, parseInt(analysis.atsScore) || 75));
        
        return {
          ...analysis,
          success: true
        };
      } else {
        throw new Error('Could not extract JSON from AI response');
      }
    } catch (error) {
      console.error('ATS Analysis AI Service Error:', error);
      
      // Return fallback analysis
      return {
        atsScore: 70,
        feedback: "Resume analysis completed. Consider optimizing for ATS compatibility by adding more keywords and improving formatting.",
        strengths: ["Professional appearance", "Clear structure"],
        improvements: ["Add industry-specific keywords", "Improve formatting", "Include more metrics"],
        success: false,
        error: error.message
      };
    }
  }
}

export default AIService;
