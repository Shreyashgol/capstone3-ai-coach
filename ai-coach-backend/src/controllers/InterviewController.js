import { UserModel, AssessmentModel } from '../models/index.js';
import AIService from '../services/AIService.js';

// In-memory storage for todos and question history (in production, use a database)
let todosStorage = [];
let questionHistory = {}; // Track questions asked per user per role

class InterviewController {
  constructor() {
    this.aiService = new AIService();
  }

  static getUserId(req) {
    return req.userId;
  }

  static async generateQuiz(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId 
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { role } = req.body;
      if (!role) {
        return res.status(400).json({ error: 'Role is required' });
      }

      // Check if user has taken this role quiz before
      const userRoleKey = `${userId}_${role}`;
      const previousQuestions = questionHistory[userRoleKey] || [];
      
      let questions;
      
      if (previousQuestions.length === 0) {
        // First time taking this role quiz - use predefined questions
        questions = InterviewController.generateRoleBasedQuestions(role);
      } else {
        // User has taken this quiz before - generate new AI questions
        console.log(`Generating AI questions for ${role} (attempt ${previousQuestions.length + 1})`);
        questions = await InterviewController.generateAIQuestions(role, previousQuestions);
      }

      // Store questions in history
      if (!questionHistory[userRoleKey]) {
        questionHistory[userRoleKey] = [];
      }
      questionHistory[userRoleKey].push(questions.map(q => q.question));

      res.json({ questions });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  }

  static generateRoleBasedQuestions(role) {
    const questionSets = {
      'software-engineer': [
        {
          question: "What is the time complexity of searching for an element in a balanced binary search tree?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: "O(log n)",
          explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time.",
          importantNotes: "Remember that this assumes the tree is balanced. An unbalanced BST can degrade to O(n).",
          type: "Technical",
          difficulty: "Medium"
        },
        {
          question: "Which design pattern is best for creating a single instance of a class?",
          options: ["Factory Pattern", "Singleton Pattern", "Observer Pattern", "Strategy Pattern"],
          correctAnswer: "Singleton Pattern",
          explanation: "The Singleton pattern ensures only one instance of a class exists and provides global access to it.",
          importantNotes: "Be careful with thread safety when implementing Singleton in multi-threaded environments.",
          type: "Design Patterns",
          difficulty: "Easy"
        },
        {
          question: "What is the main advantage of using microservices architecture?",
          options: ["Faster development", "Independent scaling and deployment", "Reduced complexity", "Lower costs"],
          correctAnswer: "Independent scaling and deployment",
          explanation: "Microservices allow each service to be scaled and deployed independently based on demand.",
          importantNotes: "While microservices offer flexibility, they also introduce complexity in service communication and data consistency.",
          type: "System Design",
          difficulty: "Medium"
        },
        {
          question: "In REST APIs, which HTTP method should be used to update a resource partially?",
          options: ["PUT", "PATCH", "POST", "UPDATE"],
          correctAnswer: "PATCH",
          explanation: "PATCH is used for partial updates, while PUT is typically used for complete resource replacement.",
          importantNotes: "Some APIs use PUT for partial updates too, but PATCH is more semantically correct.",
          type: "API Design",
          difficulty: "Easy"
        },
        {
          question: "What is the purpose of database indexing?",
          options: ["Data encryption", "Faster query performance", "Data backup", "Schema validation"],
          correctAnswer: "Faster query performance",
          explanation: "Indexes create data structures that allow the database to find rows more quickly.",
          importantNotes: "Indexes speed up reads but can slow down writes due to index maintenance overhead.",
          type: "Database",
          difficulty: "Easy"
        }
      ],
      'data-scientist': [
        {
          question: "What is the primary purpose of cross-validation in machine learning?",
          options: ["Feature selection", "Model evaluation and validation", "Data cleaning", "Hyperparameter tuning"],
          correctAnswer: "Model evaluation and validation",
          explanation: "Cross-validation helps assess how well a model generalizes to unseen data by using different train/test splits.",
          importantNotes: "K-fold cross-validation is most common, but stratified CV is better for imbalanced datasets.",
          type: "Machine Learning",
          difficulty: "Medium"
        },
        {
          question: "Which metric is most appropriate for evaluating a binary classification model with imbalanced classes?",
          options: ["Accuracy", "F1-Score", "Mean Squared Error", "R-squared"],
          correctAnswer: "F1-Score",
          explanation: "F1-Score balances precision and recall, making it better for imbalanced datasets than accuracy.",
          importantNotes: "Consider using AUC-ROC or precision-recall curves for comprehensive evaluation of imbalanced datasets.",
          type: "Model Evaluation",
          difficulty: "Medium"
        },
        {
          question: "What does the p-value represent in statistical hypothesis testing?",
          options: ["Probability the null hypothesis is true", "Probability of observing the data given null hypothesis is true", "Effect size", "Confidence level"],
          correctAnswer: "Probability of observing the data given null hypothesis is true",
          explanation: "P-value is the probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true.",
          importantNotes: "A common misconception is that p-value is the probability that the null hypothesis is true.",
          type: "Statistics",
          difficulty: "Hard"
        },
        {
          question: "Which technique is best for handling missing data when the missingness is not random?",
          options: ["Mean imputation", "Listwise deletion", "Multiple imputation", "Forward fill"],
          correctAnswer: "Multiple imputation",
          explanation: "Multiple imputation creates several plausible values for missing data, accounting for uncertainty.",
          importantNotes: "The choice depends on the mechanism of missingness (MCAR, MAR, or MNAR).",
          type: "Data Preprocessing",
          difficulty: "Hard"
        },
        {
          question: "What is the main advantage of ensemble methods like Random Forest?",
          options: ["Faster training", "Reduced overfitting", "Simpler interpretation", "Lower memory usage"],
          correctAnswer: "Reduced overfitting",
          explanation: "Ensemble methods combine multiple models to reduce variance and improve generalization.",
          importantNotes: "The trade-off is often reduced interpretability compared to single decision trees.",
          type: "Machine Learning",
          difficulty: "Medium"
        }
      ],
      'ai-engineer': [
        {
          question: "What is the vanishing gradient problem in deep neural networks?",
          options: ["Gradients become too large", "Gradients become very small in early layers", "Loss function doesn't converge", "Model overfits"],
          correctAnswer: "Gradients become very small in early layers",
          explanation: "In deep networks, gradients can become exponentially small as they propagate backward, making early layers learn very slowly.",
          importantNotes: "Solutions include skip connections (ResNet), LSTM/GRU for RNNs, and proper weight initialization.",
          type: "Deep Learning",
          difficulty: "Hard"
        },
        {
          question: "Which activation function is most commonly used in modern deep learning models?",
          options: ["Sigmoid", "Tanh", "ReLU", "Linear"],
          correctAnswer: "ReLU",
          explanation: "ReLU (Rectified Linear Unit) is computationally efficient and helps mitigate the vanishing gradient problem.",
          importantNotes: "Variants like Leaky ReLU and ELU address the 'dying ReLU' problem where neurons can become inactive.",
          type: "Neural Networks",
          difficulty: "Easy"
        },
        {
          question: "What is the main purpose of attention mechanisms in neural networks?",
          options: ["Reduce model size", "Focus on relevant parts of input", "Speed up training", "Prevent overfitting"],
          correctAnswer: "Focus on relevant parts of input",
          explanation: "Attention allows models to dynamically focus on different parts of the input when making predictions.",
          importantNotes: "Attention is the foundation of Transformer architectures and has revolutionized NLP and computer vision.",
          type: "Attention Mechanisms",
          difficulty: "Medium"
        },
        {
          question: "In transfer learning, what does 'fine-tuning' typically involve?",
          options: ["Training from scratch", "Freezing all layers", "Updating pre-trained weights with new data", "Only training the last layer"],
          correctAnswer: "Updating pre-trained weights with new data",
          explanation: "Fine-tuning involves taking a pre-trained model and continuing training on new data, often with a lower learning rate.",
          importantNotes: "Common strategies include freezing early layers and only fine-tuning later layers, or gradual unfreezing.",
          type: "Transfer Learning",
          difficulty: "Medium"
        },
        {
          question: "What is the key innovation of the Transformer architecture?",
          options: ["Convolutional layers", "Recurrent connections", "Self-attention mechanism", "Pooling operations"],
          correctAnswer: "Self-attention mechanism",
          explanation: "Transformers use self-attention to process sequences in parallel, eliminating the need for recurrence.",
          importantNotes: "This enables better parallelization and has led to breakthroughs in language models like GPT and BERT.",
          type: "Transformers",
          difficulty: "Hard"
        }
      ],
      'devops-engineer': [
        {
          question: "What is the primary benefit of using Infrastructure as Code (IaC)?",
          options: ["Faster servers", "Version control for infrastructure", "Cheaper hosting", "Better security"],
          correctAnswer: "Version control for infrastructure",
          explanation: "IaC allows infrastructure to be managed like code, with version control, testing, and reproducible deployments.",
          importantNotes: "Popular IaC tools include Terraform, CloudFormation, and Ansible.",
          type: "Infrastructure",
          difficulty: "Medium"
        },
        {
          question: "In Kubernetes, what is a Pod?",
          options: ["A cluster of nodes", "The smallest deployable unit", "A storage volume", "A network policy"],
          correctAnswer: "The smallest deployable unit",
          explanation: "A Pod is the smallest deployable unit in Kubernetes, containing one or more containers that share storage and network.",
          importantNotes: "Pods are ephemeral and typically managed by higher-level controllers like Deployments.",
          type: "Kubernetes",
          difficulty: "Easy"
        },
        {
          question: "What is the main purpose of a CI/CD pipeline?",
          options: ["Monitor applications", "Automate testing and deployment", "Manage databases", "Scale infrastructure"],
          correctAnswer: "Automate testing and deployment",
          explanation: "CI/CD pipelines automate the process of integrating code changes, running tests, and deploying applications.",
          importantNotes: "CI focuses on integration and testing, while CD handles deployment to various environments.",
          type: "CI/CD",
          difficulty: "Easy"
        },
        {
          question: "Which Docker command is used to build an image from a Dockerfile?",
          options: ["docker run", "docker build", "docker create", "docker start"],
          correctAnswer: "docker build",
          explanation: "The 'docker build' command creates a Docker image from a Dockerfile and build context.",
          importantNotes: "Use tags (-t flag) to name your images and make them easier to reference.",
          type: "Docker",
          difficulty: "Easy"
        },
        {
          question: "What is the purpose of a load balancer in a distributed system?",
          options: ["Store data", "Distribute incoming requests", "Monitor performance", "Backup files"],
          correctAnswer: "Distribute incoming requests",
          explanation: "Load balancers distribute incoming network traffic across multiple servers to ensure no single server is overwhelmed.",
          importantNotes: "Common algorithms include round-robin, least connections, and weighted distribution.",
          type: "System Architecture",
          difficulty: "Medium"
        }
      ],
      'backend-developer': [
        {
          question: "What is the main difference between SQL and NoSQL databases?",
          options: ["Speed", "Schema structure", "Cost", "Security"],
          correctAnswer: "Schema structure",
          explanation: "SQL databases use fixed schemas with tables and relationships, while NoSQL databases are schema-flexible.",
          importantNotes: "Choose based on your data structure needs: SQL for complex relationships, NoSQL for flexibility and scale.",
          type: "Databases",
          difficulty: "Easy"
        },
        {
          question: "Which HTTP status code indicates a successful POST request that created a new resource?",
          options: ["200 OK", "201 Created", "202 Accepted", "204 No Content"],
          correctAnswer: "201 Created",
          explanation: "201 Created indicates that the request was successful and a new resource was created as a result.",
          importantNotes: "The response should include a Location header pointing to the newly created resource.",
          type: "HTTP/REST",
          difficulty: "Easy"
        },
        {
          question: "What is the purpose of database connection pooling?",
          options: ["Data encryption", "Reuse database connections", "Backup data", "Query optimization"],
          correctAnswer: "Reuse database connections",
          explanation: "Connection pooling maintains a cache of database connections that can be reused, reducing connection overhead.",
          importantNotes: "This improves performance and resource utilization, especially under high load.",
          type: "Database Optimization",
          difficulty: "Medium"
        },
        {
          question: "In event-driven architecture, what is the role of a message broker?",
          options: ["Store data permanently", "Route messages between services", "Execute business logic", "Authenticate users"],
          correctAnswer: "Route messages between services",
          explanation: "Message brokers facilitate communication between services by routing, storing, and delivering messages.",
          importantNotes: "Popular message brokers include RabbitMQ, Apache Kafka, and Amazon SQS.",
          type: "System Architecture",
          difficulty: "Medium"
        },
        {
          question: "What is the main advantage of using caching in backend systems?",
          options: ["Better security", "Improved response times", "Easier debugging", "Lower development costs"],
          correctAnswer: "Improved response times",
          explanation: "Caching stores frequently accessed data in fast storage, reducing response times and database load.",
          importantNotes: "Common caching strategies include Redis, Memcached, and application-level caching.",
          type: "Performance",
          difficulty: "Easy"
        }
      ],
      'frontend-developer': [
        {
          question: "What is the Virtual DOM in React?",
          options: ["A browser API", "An in-memory representation of the real DOM", "A CSS framework", "A testing library"],
          correctAnswer: "An in-memory representation of the real DOM",
          explanation: "The Virtual DOM is a JavaScript representation of the actual DOM that React uses to optimize updates.",
          importantNotes: "React compares Virtual DOM snapshots to determine the minimal changes needed to update the real DOM.",
          type: "React",
          difficulty: "Medium"
        },
        {
          question: "Which CSS property is used to create a flexible layout?",
          options: ["display: block", "display: flex", "position: absolute", "float: left"],
          correctAnswer: "display: flex",
          explanation: "Flexbox (display: flex) provides a flexible way to arrange and distribute space among items in a container.",
          importantNotes: "CSS Grid is another powerful layout system for two-dimensional layouts.",
          type: "CSS",
          difficulty: "Easy"
        },
        {
          question: "What is the purpose of the 'key' prop in React lists?",
          options: ["Styling", "Help React identify which items have changed", "Event handling", "State management"],
          correctAnswer: "Help React identify which items have changed",
          explanation: "Keys help React identify which list items have changed, been added, or removed for efficient re-rendering.",
          importantNotes: "Use stable, unique identifiers as keys, not array indices when the list can change.",
          type: "React",
          difficulty: "Medium"
        },
        {
          question: "Which method is used to make HTTP requests in modern JavaScript?",
          options: ["XMLHttpRequest", "fetch()", "jQuery.ajax()", "http.get()"],
          correctAnswer: "fetch()",
          explanation: "The fetch() API is the modern standard for making HTTP requests in JavaScript, returning promises.",
          importantNotes: "fetch() doesn't reject on HTTP error status codes (like 404), only on network errors.",
          type: "JavaScript",
          difficulty: "Easy"
        },
        {
          question: "What is the main benefit of code splitting in web applications?",
          options: ["Better SEO", "Reduced initial bundle size", "Improved security", "Easier testing"],
          correctAnswer: "Reduced initial bundle size",
          explanation: "Code splitting breaks your bundle into smaller chunks that can be loaded on demand, improving initial load time.",
          importantNotes: "React.lazy() and dynamic imports are common ways to implement code splitting.",
          type: "Performance",
          difficulty: "Medium"
        }
      ]
    };

    return questionSets[role] || questionSets['software-engineer'];
  }

  static async generateAIQuestions(role, previousQuestions) {
    try {
      const aiService = new AIService();
      
      // Flatten previous questions to avoid repetition
      const askedQuestions = previousQuestions.flat();
      
      // Define role-specific topics and skills
      const roleTopics = {
        'software-engineer': {
          topics: ['Data Structures', 'Algorithms', 'System Design', 'Object-Oriented Programming', 'Database Design', 'API Design', 'Software Architecture', 'Design Patterns'],
          skills: ['Problem Solving', 'Code Optimization', 'Scalability', 'Performance', 'Security', 'Testing']
        },
        'data-scientist': {
          topics: ['Machine Learning', 'Statistics', 'Data Analysis', 'Feature Engineering', 'Model Evaluation', 'Data Visualization', 'Big Data', 'Deep Learning'],
          skills: ['Statistical Analysis', 'Model Selection', 'Data Preprocessing', 'Hypothesis Testing', 'A/B Testing', 'Business Intelligence']
        },
        'ai-engineer': {
          topics: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'Natural Language Processing', 'Reinforcement Learning', 'MLOps', 'Model Deployment', 'AI Ethics'],
          skills: ['Model Architecture', 'Training Optimization', 'Transfer Learning', 'Model Serving', 'Performance Tuning', 'Research Implementation']
        },
        'devops-engineer': {
          topics: ['Infrastructure as Code', 'CI/CD', 'Containerization', 'Orchestration', 'Monitoring', 'Cloud Platforms', 'Security', 'Automation'],
          skills: ['System Administration', 'Deployment Strategies', 'Performance Monitoring', 'Incident Response', 'Capacity Planning', 'Cost Optimization']
        },
        'backend-developer': {
          topics: ['API Development', 'Database Design', 'Microservices', 'Caching', 'Message Queues', 'Authentication', 'Performance Optimization', 'Distributed Systems'],
          skills: ['Server Architecture', 'Data Modeling', 'Scalability', 'Security Implementation', 'Integration Patterns', 'Error Handling']
        },
        'frontend-developer': {
          topics: ['JavaScript Frameworks', 'CSS Architecture', 'Performance Optimization', 'Browser APIs', 'State Management', 'Testing', 'Accessibility', 'Build Tools'],
          skills: ['UI/UX Implementation', 'Cross-browser Compatibility', 'Responsive Design', 'Code Splitting', 'SEO Optimization', 'User Experience']
        }
      };

      const currentRole = roleTopics[role] || roleTopics['software-engineer'];
      
      const prompt = `
        Generate 5 technical interview questions for a ${role.replace('-', ' ')} position.
        
        Requirements:
        - Focus on these topics: ${currentRole.topics.join(', ')}
        - Test these skills: ${currentRole.skills.join(', ')}
        - Each question should be multiple choice with 4 options
        - Include a mix of difficulty levels (Easy, Medium, Hard)
        - Avoid these previously asked questions: ${askedQuestions.slice(-10).join('; ')}
        - Make questions practical and relevant to real-world scenarios
        - Include detailed explanations and important notes for each question
        
        Return the response as a JSON array with this exact structure:
        [
          {
            "question": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Correct option text",
            "explanation": "Detailed explanation of why this is correct",
            "importantNotes": "Additional important information or tips",
            "type": "Topic category (e.g., Machine Learning, System Design)",
            "difficulty": "Easy|Medium|Hard"
          }
        ]
        
        Ensure the JSON is valid and properly formatted.
      `;

      const result = await aiService.model.generateContent(prompt);
      const responseText = result.response.text().trim();
      
      // Clean up the response to extract JSON
      let jsonText = responseText;
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].trim();
      }
      
      try {
        const aiQuestions = JSON.parse(jsonText);
        
        // Validate and ensure we have the right structure
        if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
          return aiQuestions.map(q => ({
            question: q.question || 'Generated question',
            options: Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A',
            explanation: q.explanation || 'AI-generated explanation',
            importantNotes: q.importantNotes || 'Additional context provided by AI',
            type: q.type || currentRole.topics[0],
            difficulty: q.difficulty || 'Medium'
          }));
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.log('Raw AI response:', responseText);
      }
      
      // Fallback to predefined questions if AI generation fails
      console.log('AI generation failed, falling back to predefined questions');
      return InterviewController.generateRoleBasedQuestions(role);
      
    } catch (error) {
      console.error('AI Question Generation Error:', error);
      // Fallback to predefined questions
      return InterviewController.generateRoleBasedQuestions(role);
    }
  }

  static async saveQuizResult(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { role, questions = [], answers = [], score = 0 } = req.body || {};

      const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
        importantNotes: q.importantNotes,
        type: q.type,
        difficulty: q.difficulty
      }));

      const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
      const correctAnswers = questionResults.filter((q) => q.isCorrect);
      
      // Generate AI feedback
      const feedback = InterviewController.generateAIFeedback(role, questionResults, score, questions.length);
      
      // Create learning todos based on wrong answers
      const todos = InterviewController.createLearningTodos(userId, role, wrongAnswers);
      
      // Save todos to storage
      todosStorage.push(...todos);

      const assessment = await AssessmentModel.create({
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: role,
        improvementTip: feedback.overall,
      });

      res.json({
        ...assessment,
        feedback,
        todosCreated: todos.length
      });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to save quiz result' });
    }
  }

  static generateAIFeedback(role, questionResults, score, totalQuestions) {
    const percentage = (score / totalQuestions) * 100;
    const wrongAnswers = questionResults.filter(q => !q.isCorrect);
    const correctAnswers = questionResults.filter(q => q.isCorrect);
    
    let overall = '';
    let strengths = [];
    let improvements = [];

    // Overall performance feedback
    if (percentage >= 80) {
      overall = `Excellent performance! You scored ${score}/${totalQuestions} (${Math.round(percentage)}%) on this ${role} assessment. You demonstrate strong technical knowledge and are well-prepared for interviews in this role.`;
    } else if (percentage >= 60) {
      overall = `Good job! You scored ${score}/${totalQuestions} (${Math.round(percentage)}%) on this ${role} assessment. You have a solid foundation but there are some areas where additional study would be beneficial.`;
    } else {
      overall = `You scored ${score}/${totalQuestions} (${Math.round(percentage)}%) on this ${role} assessment. This indicates there are several key concepts that would benefit from additional study and practice.`;
    }

    // Identify strengths based on correct answers
    const strengthAreas = {};
    correctAnswers.forEach(q => {
      strengthAreas[q.type] = (strengthAreas[q.type] || 0) + 1;
    });

    Object.entries(strengthAreas).forEach(([type, count]) => {
      if (count >= 2) {
        strengths.push(`Strong understanding of ${type} concepts`);
      }
    });

    if (strengths.length === 0 && correctAnswers.length > 0) {
      strengths.push('Shows good problem-solving approach');
    }

    // Identify improvement areas based on wrong answers
    const improvementAreas = {};
    wrongAnswers.forEach(q => {
      improvementAreas[q.type] = (improvementAreas[q.type] || 0) + 1;
    });

    Object.entries(improvementAreas).forEach(([type, count]) => {
      improvements.push(`Review ${type} fundamentals and practice more problems`);
    });

    // Add role-specific recommendations
    const roleRecommendations = {
      'software-engineer': ['Practice coding problems on LeetCode or HackerRank', 'Review system design patterns'],
      'data-scientist': ['Practice with real datasets on Kaggle', 'Review statistical concepts and ML algorithms'],
      'ai-engineer': ['Implement neural networks from scratch', 'Study recent papers in your area of interest'],
      'devops-engineer': ['Set up practice environments with Docker and Kubernetes', 'Learn Infrastructure as Code tools'],
      'backend-developer': ['Build REST APIs and practice database design', 'Study distributed systems concepts'],
      'frontend-developer': ['Build responsive web applications', 'Practice modern JavaScript and framework patterns']
    };

    if (percentage < 70) {
      improvements.push(...(roleRecommendations[role] || []));
    }

    return {
      overall,
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 4)
    };
  }

  static createLearningTodos(userId, role, wrongAnswers) {
    const todos = [];
    const todoId = Date.now();

    wrongAnswers.forEach((wrongAnswer, index) => {
      const todo = {
        id: `${todoId}_${index}`,
        userId,
        title: `Study ${wrongAnswer.type}: ${wrongAnswer.question.substring(0, 50)}...`,
        description: `Review the concept: ${wrongAnswer.explanation}`,
        category: wrongAnswer.type,
        priority: wrongAnswer.difficulty === 'Hard' ? 'High' : wrongAnswer.difficulty === 'Medium' ? 'Medium' : 'Low',
        completed: false,
        createdAt: new Date().toISOString(),
        role: role,
        relatedQuestion: wrongAnswer.question,
        importantNotes: wrongAnswer.importantNotes
      };
      todos.push(todo);
    });

    // Add general improvement todos based on role
    const generalTodos = {
      'software-engineer': [
        { title: 'Practice Data Structures & Algorithms', description: 'Solve 5 problems on LeetCode focusing on trees and graphs', category: 'Algorithms', priority: 'High' },
        { title: 'Review System Design Patterns', description: 'Study common patterns like MVC, Observer, and Singleton', category: 'System Design', priority: 'Medium' }
      ],
      'data-scientist': [
        { title: 'Practice Statistical Analysis', description: 'Review hypothesis testing and confidence intervals', category: 'Statistics', priority: 'High' },
        { title: 'Implement ML Algorithm from Scratch', description: 'Code a linear regression or decision tree without libraries', category: 'Machine Learning', priority: 'Medium' }
      ],
      'ai-engineer': [
        { title: 'Study Neural Network Architectures', description: 'Deep dive into CNN, RNN, and Transformer architectures', category: 'Deep Learning', priority: 'High' },
        { title: 'Practice Model Optimization', description: 'Learn about regularization, dropout, and hyperparameter tuning', category: 'Model Optimization', priority: 'Medium' }
      ]
    };

    if (wrongAnswers.length >= 2) {
      const roleTodos = generalTodos[role] || [];
      roleTodos.forEach((todoTemplate, index) => {
        const todo = {
          id: `${todoId}_general_${index}`,
          userId,
          ...todoTemplate,
          completed: false,
          createdAt: new Date().toISOString(),
          role: role
        };
        todos.push(todo);
      });
    }

    return todos;
  }

  static async getTodos(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userTodos = todosStorage.filter(todo => todo.userId === userId);
      
      res.json({ todos: userTodos });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  }

  static async markTodoComplete(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const todoIndex = todosStorage.findIndex(todo => todo.id === id && todo.userId === userId);
      
      if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      todosStorage[todoIndex].completed = !todosStorage[todoIndex].completed;
      todosStorage[todoIndex].completedAt = todosStorage[todoIndex].completed ? new Date().toISOString() : null;

      res.json({ message: 'Todo updated successfully', todo: todosStorage[todoIndex] });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to update todo' });
    }
  }

  static async deleteTodo(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      const { id } = req.params;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const todoIndex = todosStorage.findIndex(todo => todo.id === id && todo.userId === userId);
      
      if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      // Remove the todo from storage
      const deletedTodo = todosStorage.splice(todoIndex, 1)[0];

      res.json({ 
        message: 'Todo deleted successfully', 
        deletedTodo: {
          id: deletedTodo.id,
          title: deletedTodo.title
        }
      });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }

  static async getQuizHistory(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user's quiz history
      const userHistory = {};
      Object.keys(questionHistory).forEach(key => {
        if (key.startsWith(userId + '_')) {
          const role = key.replace(userId + '_', '');
          userHistory[role] = {
            attempts: questionHistory[key].length,
            lastAttempt: new Date().toISOString(), // In real app, track actual timestamps
            totalQuestions: questionHistory[key].reduce((sum, questions) => sum + questions.length, 0)
          };
        }
      });

      res.json({ history: userHistory });
    } catch (err) {
      console.error('Quiz History Error:', err);
      res.status(500).json({ error: 'Failed to fetch quiz history' });
    }
  }

  static async getAssessments(req, res) {
    try {
      const userId = InterviewController.getUserId(req);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const assessments = await AssessmentModel.findByUserId(user.id);

      res.json({ assessments });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to fetch assessments' });
    }
  }

  static async getAssessmentById(req, res) {
    try {
      const { id } = req.params;
      const userId = InterviewController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const assessment = await AssessmentModel.findById(id);

      if (!assessment || assessment.userId !== user.id) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      res.json({ assessment });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to fetch assessment' });
    }
  }

  static async deleteAssessment(req, res) {
    try {
      const { id } = req.params;
      const userId = InterviewController.getUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = req.userId
        ? await UserModel.findById(req.userId)
        : await UserModel.findByClerkUserId(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if assessment exists and belongs to user
      const existingAssessment = await AssessmentModel.findById(id);

      if (!existingAssessment || existingAssessment.userId !== user.id) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      await AssessmentModel.delete(id);

      res.json({ message: 'Assessment deleted successfully' });
    } catch (err) {
      console.error('Interview Controller Error:', err);
      res.status(500).json({ error: 'Failed to delete assessment' });
    }
  }
}

export default InterviewController;
