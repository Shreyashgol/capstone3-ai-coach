import { UserModel, AssessmentModel, CoverLetterModel } from '../models/index.js';
import IndustryService from '../services/IndustryService.js';

class DashboardController {
  constructor() {
    this.industryService = new IndustryService();
  }

  static getUserId(req) {
    return req.userId;
  }

  static async getIndustryInsights(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.industry) {
        return res.status(400).json({ error: 'User has no industry set' });
      }

      const industryService = new IndustryService();
      const insight = await industryService.getIndustryInsights(user.industry);

      return res.json(insight);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to fetch insights' });
    }
  }

  static async refreshIndustryInsights(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (!user.industry) {
        return res.status(400).json({ error: 'User has no industry set' });
      }

      const industryService = new IndustryService();
      const insight = await industryService.refreshIndustryInsights(user.industry);

      return res.json(insight);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to refresh insights' });
    }
  }

  static async getJobCategoryInsights(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Define tech job categories with their specific data
      const jobCategories = [
        'Software Engineer',
        'Data Scientist', 
        'AI Engineer',
        'Web Developer',
        'Backend Developer',
        'DevOps Engineer',
        'App Developer'
      ];

      const industryService = new IndustryService();
      
      const insights = await Promise.all(
        jobCategories.map(async (category) => {
          try {
            // Generate AI insights for each job category
            const aiInsights = await industryService.aiService.generateJobCategoryInsights(category);
            
            return {
              category,
              ...aiInsights,
              // Add real-time mock data
              currentJobs: Math.floor(Math.random() * 8000) + 2000,
              growthTrend: Math.random() > 0.3 ? 'up' : 'down',
              lastUpdated: new Date().toISOString(),
              // Add specific salary data for each role
              salaryRanges: DashboardController.getSalaryDataForCategory(category),
              // Add specific skills for each category
              topSkills: DashboardController.getSkillsForCategory(category),
              inDemandSkills: DashboardController.getInDemandSkillsForCategory(category),
              skillsToLearn: DashboardController.getSkillsToLearnForCategory(category)
            };
          } catch (error) {
            console.error(`Failed to get insights for ${category}:`, error);
            return DashboardController.getFallbackDataForCategory(category);
          }
        })
      );

      return res.json({ jobCategories: insights });
    } catch (err) {
      console.error('Job Category Insights Error:', err);
      return res.status(500).json({ error: 'Failed to fetch job category insights' });
    }
  }

  static getSalaryDataForCategory(category) {
    // Indian market salary data in INR (Lakhs per annum)
    const salaryData = {
      'Software Engineer': [
        { role: 'Fresher/Graduate Trainee', min: 350000, max: 600000, median: 475000 },
        { role: 'Software Developer (2-4 years)', min: 600000, max: 1200000, median: 900000 },
        { role: 'Senior Software Engineer (4-7 years)', min: 1200000, max: 2500000, median: 1850000 },
        { role: 'Tech Lead/Architect (7+ years)', min: 2500000, max: 5000000, median: 3750000 }
      ],
      'Data Scientist': [
        { role: 'Junior Data Analyst', min: 400000, max: 800000, median: 600000 },
        { role: 'Data Scientist (2-4 years)', min: 800000, max: 1500000, median: 1150000 },
        { role: 'Senior Data Scientist (4-7 years)', min: 1500000, max: 3000000, median: 2250000 },
        { role: 'Principal Data Scientist/Manager', min: 3000000, max: 6000000, median: 4500000 }
      ],
      'AI Engineer': [
        { role: 'ML Engineer (Fresher)', min: 500000, max: 900000, median: 700000 },
        { role: 'AI/ML Engineer (2-4 years)', min: 900000, max: 1800000, median: 1350000 },
        { role: 'Senior AI Engineer (4-7 years)', min: 1800000, max: 3500000, median: 2650000 },
        { role: 'AI Architect/Research Lead', min: 3500000, max: 7000000, median: 5250000 }
      ],
      'Web Developer': [
        { role: 'Frontend Developer (Fresher)', min: 300000, max: 500000, median: 400000 },
        { role: 'Full Stack Developer (2-4 years)', min: 500000, max: 1000000, median: 750000 },
        { role: 'Senior Full Stack Developer', min: 1000000, max: 2000000, median: 1500000 },
        { role: 'Frontend Architect/Lead', min: 2000000, max: 3500000, median: 2750000 }
      ],
      'Backend Developer': [
        { role: 'Backend Developer (Fresher)', min: 350000, max: 600000, median: 475000 },
        { role: 'Backend Engineer (2-4 years)', min: 600000, max: 1300000, median: 950000 },
        { role: 'Senior Backend Engineer', min: 1300000, max: 2500000, median: 1900000 },
        { role: 'Backend Architect/Principal', min: 2500000, max: 4500000, median: 3500000 }
      ],
      'DevOps Engineer': [
        { role: 'DevOps Engineer (Fresher)', min: 400000, max: 700000, median: 550000 },
        { role: 'DevOps Engineer (2-4 years)', min: 700000, max: 1400000, median: 1050000 },
        { role: 'Senior DevOps Engineer', min: 1400000, max: 2800000, median: 2100000 },
        { role: 'DevOps Architect/SRE Lead', min: 2800000, max: 5000000, median: 3900000 }
      ],
      'App Developer': [
        { role: 'Mobile App Developer (Fresher)', min: 300000, max: 550000, median: 425000 },
        { role: 'Mobile Developer (2-4 years)', min: 550000, max: 1100000, median: 825000 },
        { role: 'Senior Mobile Developer', min: 1100000, max: 2200000, median: 1650000 },
        { role: 'Mobile Architect/Lead', min: 2200000, max: 4000000, median: 3100000 }
      ]
    };
    return salaryData[category] || salaryData['Software Engineer'];
  }

  static getSkillsForCategory(category) {
    const skillsData = {
      'Software Engineer': ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
      'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy', 'Tableau'],
      'AI Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
      'Web Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'MongoDB', 'Responsive Design'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Redis', 'Docker', 'Microservices'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Linux', 'CI/CD', 'Monitoring'],
      'App Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'API Integration', 'UI/UX', 'Testing']
    };
    return skillsData[category] || skillsData['Software Engineer'];
  }

  static getInDemandSkillsForCategory(category) {
    const inDemandSkills = {
      'Software Engineer': ['TypeScript', 'GraphQL', 'Microservices', 'Cloud Architecture', 'System Design'],
      'Data Scientist': ['MLOps', 'Big Data', 'Cloud Platforms', 'A/B Testing', 'Data Engineering'],
      'AI Engineer': ['Generative AI', 'LLMs', 'Computer Vision', 'Reinforcement Learning', 'Edge AI'],
      'Web Developer': ['Next.js', 'TypeScript', 'PWA', 'WebAssembly', 'JAMstack'],
      'Backend Developer': ['Serverless', 'Event-Driven Architecture', 'gRPC', 'Message Queues', 'Database Optimization'],
      'DevOps Engineer': ['GitOps', 'Service Mesh', 'Observability', 'Infrastructure as Code', 'Security'],
      'App Developer': ['Cross-Platform', 'AR/VR', 'IoT Integration', 'Performance Optimization', 'Security']
    };
    return inDemandSkills[category] || inDemandSkills['Software Engineer'];
  }

  static getSkillsToLearnForCategory(category) {
    const skillsToLearn = {
      'Software Engineer': ['AI/ML Basics', 'Cloud Native', 'Security Best Practices', 'Performance Optimization'],
      'Data Scientist': ['Deep Learning', 'Real-time Analytics', 'Data Governance', 'AutoML'],
      'AI Engineer': ['Prompt Engineering', 'Model Deployment', 'AI Ethics', 'Distributed Training'],
      'Web Developer': ['Web3', 'Advanced CSS', 'Performance Monitoring', 'Accessibility'],
      'Backend Developer': ['Event Sourcing', 'CQRS', 'Distributed Systems', 'API Security'],
      'DevOps Engineer': ['Platform Engineering', 'FinOps', 'Chaos Engineering', 'Green Computing'],
      'App Developer': ['Machine Learning on Mobile', 'Augmented Reality', 'Voice Interfaces', 'Wearables']
    };
    return skillsToLearn[category] || skillsToLearn['Software Engineer'];
  }

  static getFallbackDataForCategory(category) {
    return {
      category,
      demandLevel: 'High',
      growthRate: Math.floor(Math.random() * 15) + 8,
      currentJobs: Math.floor(Math.random() * 8000) + 2000,
      growthTrend: 'up',
      marketOutlook: 'Positive growth expected with increasing demand for digital transformation.',
      keyTrends: ['Remote Work', 'AI Integration', 'Cloud Adoption', 'Agile Practices'],
      salaryRanges: DashboardController.getSalaryDataForCategory(category),
      topSkills: DashboardController.getSkillsForCategory(category),
      inDemandSkills: DashboardController.getInDemandSkillsForCategory(category),
      skillsToLearn: DashboardController.getSkillsToLearnForCategory(category),
      lastUpdated: new Date().toISOString()
    };
  }

  static async getSalaryTrends(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { category } = req.query;
      
      // Generate salary trend data for the past 12 months
      const months = [];
      const currentDate = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          date: date.toISOString()
        });
      }

      const salaryTrends = months.map((month, index) => {
        const baseData = DashboardController.getSalaryDataForCategory(category || 'Software Engineer');
        const growthFactor = 1 + (index * 0.005); // 0.5% growth per month
        
        return {
          month: month.month,
          date: month.date,
          junior: Math.round(baseData[0].median * growthFactor),
          midLevel: Math.round(baseData[1].median * growthFactor),
          senior: Math.round(baseData[2].median * growthFactor),
          lead: Math.round(baseData[3].median * growthFactor),
          // Add market indicators
          demandIndex: Math.floor(Math.random() * 20) + 80, // 80-100
          jobOpenings: Math.floor(Math.random() * 2000) + 3000,
          competitionLevel: Math.random() > 0.5 ? 'High' : 'Medium'
        };
      });

      return res.json({
        category: category || 'Software Engineer',
        trends: salaryTrends,
        summary: {
          yearOverYearGrowth: '8.5%',
          averageIncrease: '₹2.5 Lakhs',
          topPayingCompanies: ['Google India', 'Microsoft India', 'Amazon India', 'Flipkart', 'Paytm', 'Zomato'],
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Salary Trends Error:', err);
      return res.status(500).json({ error: 'Failed to fetch salary trends' });
    }
  }

  static async getMarketInsights(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const insights = {
        marketOverview: {
          totalJobs: 125000,
          weeklyGrowth: 4.8,
          topGrowingRoles: ['AI/ML Engineer', 'DevOps Engineer', 'Data Scientist'],
          emergingTechnologies: ['Generative AI', 'Blockchain', 'IoT', 'AR/VR'],
          lastUpdated: new Date().toISOString()
        },
        skillDemand: {
          hotSkills: [
            { skill: 'Python', demand: 95, growth: '+35%' },
            { skill: 'React.js', demand: 92, growth: '+28%' },
            { skill: 'Node.js', demand: 88, growth: '+25%' },
            { skill: 'AWS/Azure', demand: 85, growth: '+40%' },
            { skill: 'Machine Learning', demand: 90, growth: '+45%' },
            { skill: 'Docker/Kubernetes', demand: 82, growth: '+38%' },
            { skill: 'MongoDB', demand: 78, growth: '+22%' },
            { skill: 'Java/Spring Boot', demand: 80, growth: '+18%' }
          ],
          emergingSkills: [
            { skill: 'Generative AI/LLMs', demand: 85, growth: '+150%' },
            { skill: 'DevOps/SRE', demand: 78, growth: '+65%' },
            { skill: 'Microservices', demand: 75, growth: '+45%' },
            { skill: 'Flutter/React Native', demand: 70, growth: '+55%' }
          ]
        },
        industryTrends: [
          {
            trend: 'Digital India Initiative',
            impact: 'High',
            description: 'Government push for digitalization creating massive opportunities in fintech, edtech, and govtech',
            affectedRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'],
            timeframe: '2024-2027'
          },
          {
            trend: 'Startup Ecosystem Growth',
            impact: 'High',
            description: 'India becoming the 3rd largest startup ecosystem globally with unicorns in multiple sectors',
            affectedRoles: ['Full Stack Developer', 'DevOps Engineer', 'AI Engineer'],
            timeframe: 'Ongoing'
          },
          {
            trend: 'Remote/Hybrid Work Culture',
            impact: 'Medium',
            description: 'Post-pandemic shift to flexible work arrangements becoming permanent',
            affectedRoles: ['All Tech Roles'],
            timeframe: 'Ongoing'
          },
          {
            trend: 'AI/ML Adoption in Enterprises',
            impact: 'Very High',
            description: 'Indian enterprises rapidly adopting AI for automation, analytics, and customer experience',
            affectedRoles: ['Data Scientist', 'AI Engineer', 'Backend Developer'],
            timeframe: '2024-2026'
          }
        ],
        geographicInsights: [
          { location: 'Bangalore (Silicon Valley of India)', avgSalary: 1800000, jobCount: 45000, growth: '+12%' },
          { location: 'Hyderabad (Cyberabad)', avgSalary: 1600000, jobCount: 32000, growth: '+15%' },
          { location: 'Pune (IT Hub)', avgSalary: 1500000, jobCount: 28000, growth: '+10%' },
          { location: 'Chennai (Detroit of India)', avgSalary: 1400000, jobCount: 25000, growth: '+8%' },
          { location: 'Gurgaon/Noida (NCR)', avgSalary: 1700000, jobCount: 35000, growth: '+11%' },
          { location: 'Mumbai (Financial Capital)', avgSalary: 1900000, jobCount: 30000, growth: '+9%' }
        ],
        companyInsights: {
          hiringMost: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL Technologies'],
          fastestGrowing: ['Byju\'s', 'Zomato', 'Paytm', 'Swiggy', 'Ola', 'Flipkart', 'PhonePe'],
          bestBenefits: ['Google India', 'Microsoft India', 'Amazon India', 'Adobe India', 'Salesforce India'],
          topStartups: ['Razorpay', 'Freshworks', 'Zerodha', 'Dream11', 'Unacademy', 'Meesho'],
          mncsInIndia: ['IBM India', 'Oracle India', 'SAP Labs', 'VMware India', 'Cisco India'],
          remoteFirst: ['GitLab', 'Automattic', 'Buffer', 'Toptal', 'InVision']
        }
      };

      return res.json(insights);
    } catch (err) {
      console.error('Market Insights Error:', err);
      return res.status(500).json({ error: 'Failed to fetch market insights' });
    }
  }

  static async getSkillAnalytics(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { category } = req.query;
      const selectedCategory = category || 'Software Engineer';

      const analytics = {
        category: selectedCategory,
        skillGaps: [
          { skill: 'Cloud Architecture', currentLevel: 65, requiredLevel: 85, gap: 20 },
          { skill: 'System Design', currentLevel: 70, requiredLevel: 90, gap: 20 },
          { skill: 'Microservices', currentLevel: 60, requiredLevel: 80, gap: 20 },
          { skill: 'DevOps', currentLevel: 55, requiredLevel: 75, gap: 20 },
          { skill: 'Security', currentLevel: 50, requiredLevel: 80, gap: 30 }
        ],
        learningPath: [
          {
            phase: 'Foundation',
            duration: '2-3 months',
            skills: ['Git Advanced', 'Testing Fundamentals', 'Code Review'],
            priority: 'High'
          },
          {
            phase: 'Intermediate',
            duration: '3-4 months', 
            skills: ['System Design Basics', 'Database Optimization', 'API Design'],
            priority: 'High'
          },
          {
            phase: 'Advanced',
            duration: '4-6 months',
            skills: ['Distributed Systems', 'Performance Optimization', 'Security'],
            priority: 'Medium'
          }
        ],
        certifications: [
          { name: 'AWS Solutions Architect', provider: 'Amazon', difficulty: 'Intermediate', value: 'High' },
          { name: 'Google Cloud Professional', provider: 'Google', difficulty: 'Intermediate', value: 'High' },
          { name: 'Kubernetes Administrator', provider: 'CNCF', difficulty: 'Advanced', value: 'Very High' },
          { name: 'Azure Developer Associate', provider: 'Microsoft', difficulty: 'Intermediate', value: 'High' }
        ],
        marketDemand: DashboardController.getInDemandSkillsForCategory(selectedCategory).map(skill => ({
          skill,
          demand: Math.floor(Math.random() * 30) + 70,
          salaryImpact: `+₹${Math.floor(Math.random() * 8) + 2} Lakhs`,
          jobOpenings: Math.floor(Math.random() * 1000) + 500
        }))
      };

      return res.json(analytics);
    } catch (err) {
      console.error('Skill Analytics Error:', err);
      return res.status(500).json({ error: 'Failed to fetch skill analytics' });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const userId = DashboardController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId 
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get various stats for dashboard
      const [coverLetters, assessments] = await Promise.all([
        CoverLetterModel.findByUserId(user.id),
        AssessmentModel.findByUserId(user.id)
      ]);

      // Calculate performance metrics
      const avgScore = assessments.length > 0 
        ? assessments.reduce((sum, a) => sum + a.quizScore, 0) / assessments.length 
        : 0;

      const recentActivity = [
        ...coverLetters.slice(0, 3).map(cl => ({
          type: 'cover_letter',
          title: `Cover Letter for ${cl.jobTitle}`,
          date: cl.createdAt,
          status: cl.status
        })),
        ...assessments.slice(0, 3).map(a => ({
          type: 'assessment',
          title: `${a.category} Assessment`,
          date: a.createdAt,
          score: a.quizScore
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      const stats = {
        coverLettersCount: coverLetters.length,
        assessmentsCount: assessments.length,
        averageScore: Math.round(avgScore * 10) / 10,
        recentActivity,
        recentAssessments: assessments.slice(0, 5).map(a => ({
          id: a.id,
          quizScore: a.quizScore,
          category: a.category,
          createdAt: a.createdAt
        })),
        user: {
          industry: user.industry,
          experience: user.experience,
          skills: user.skills,
          name: user.name,
          email: user.email
        },
        // Performance over time (mock data for now)
        performanceData: assessments.slice(-6).map((a, index) => ({
          month: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short' }),
          score: a.quizScore,
          assessments: 1
        }))
      };

      return res.json(stats);
    } catch (err) {
      console.error('Dashboard Controller Error:', err);
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }
}

export default DashboardController;
