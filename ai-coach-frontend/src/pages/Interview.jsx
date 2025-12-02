import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useApiHeaders } from '@/hooks/useApiHeaders'
import { 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  TrendingUp,
  Brain,
  Code,
  Users,
  Lightbulb,
  Award,
  Zap,
  Star,
  Trophy,
  Trash2,
  MoreVertical
} from 'lucide-react'

export default function Interview() {
  const [selectedRole, setSelectedRole] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [assessments, setAssessments] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [todos, setTodos] = useState([])
  const [quizHistory, setQuizHistory] = useState({})
  const [isAIGenerated, setIsAIGenerated] = useState(false)
  const { headers } = useApiHeaders()

  const techRoles = [
    { 
      id: 'software-engineer', 
      name: 'Software Engineer', 
      icon: <Code className="h-5 w-5" />,
      skills: ['JavaScript', 'Python', 'System Design', 'Algorithms', 'Data Structures'],
      description: 'Full-stack development and system architecture'
    },
    { 
      id: 'data-scientist', 
      name: 'Data Scientist', 
      icon: <TrendingUp className="h-5 w-5" />,
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
      description: 'Data analysis and machine learning models'
    },
    { 
      id: 'ai-engineer', 
      name: 'AI Engineer', 
      icon: <Brain className="h-5 w-5" />,
      skills: ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
      description: 'AI/ML model development and deployment'
    },
    { 
      id: 'devops-engineer', 
      name: 'DevOps Engineer', 
      icon: <Target className="h-5 w-5" />,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Infrastructure as Code'],
      description: 'Infrastructure automation and deployment'
    },
    { 
      id: 'backend-developer', 
      name: 'Backend Developer', 
      icon: <Code className="h-5 w-5" />,
      skills: ['Node.js', 'Databases', 'APIs', 'Microservices', 'System Design'],
      description: 'Server-side development and architecture'
    },
    { 
      id: 'frontend-developer', 
      name: 'Frontend Developer', 
      icon: <Users className="h-5 w-5" />,
      skills: ['React', 'JavaScript', 'CSS', 'UI/UX', 'Performance Optimization'],
      description: 'User interface and experience development'
    }
  ]

  useEffect(() => {
    fetchAssessments()
    fetchTodos()
    fetchQuizHistory()
  }, [])

  const fetchAssessments = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/interview/assessments`, { headers })
      const data = await res.json()
      setAssessments(data.assessments || [])
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
    }
  }

  const fetchTodos = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/interview/todos`, { headers })
      const data = await res.json()
      setTodos(data.todos || [])
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  const fetchQuizHistory = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/interview/quiz-history`, { headers })
      const data = await res.json()
      setQuizHistory(data.history || {})
    } catch (error) {
      console.error('Failed to fetch quiz history:', error)
    }
  }

  const generate = async () => {
    if (!selectedRole) {
      alert('Please select a role first!')
      return
    }
    
    setLoading(true)
    setScore(null)
    setAnswers({})
    setShowResults(false)
    setQuizResults(null)
    
    // Check if this is a repeat attempt (AI generation will be used)
    const roleHistory = quizHistory[selectedRole]
    const willUseAI = roleHistory && roleHistory.attempts > 0
    setIsAIGenerated(willUseAI)
    
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/interview/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ role: selectedRole })
      })
      const data = await res.json()
      setQuestions(Array.isArray(data.questions) ? data.questions : [])
      
      // Refresh quiz history after generating new questions
      fetchQuizHistory()
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    const ansArray = questions.map((_, idx) => answers[idx] || null)
    const scoreCalc = questions.reduce((acc, q, idx) => acc + (q.correctAnswer === ansArray[idx] ? 1 : 0), 0)
    
    setSubmitting(true)
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/interview/save-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ 
          role: selectedRole,
          questions, 
          answers: ansArray, 
          score: scoreCalc 
        })
      })
      const result = await res.json()
      setScore(scoreCalc)
      setQuizResults(result)
      setShowResults(true)
      fetchAssessments()
      fetchTodos() // Refresh todos as new ones might be created
    } finally {
      setSubmitting(false)
    }
  }

  const markTodoComplete = async (todoId) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      await fetch(`${baseURL}/api/interview/todos/${todoId}/complete`, {
        method: 'PATCH',
        headers
      })
      fetchTodos()
    } catch (error) {
      console.error('Failed to mark todo complete:', error)
    }
  }

  const deleteTodo = async (todoId, todoTitle) => {
    if (window.confirm(`Are you sure you want to delete "${todoTitle}"?`)) {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
        await fetch(`${baseURL}/api/interview/todos/${todoId}`, {
          method: 'DELETE',
          headers
        })
        fetchTodos()
      } catch (error) {
        console.error('Failed to delete todo:', error)
      }
    }
  }

  const deleteAssessment = async (assessmentId, assessmentCategory) => {
    if (window.confirm(`Are you sure you want to delete the ${assessmentCategory} assessment?`)) {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
        await fetch(`${baseURL}/api/interview/assessments/${assessmentId}`, {
          method: 'DELETE',
          headers
        })
        fetchAssessments()
      } catch (error) {
        console.error('Failed to delete assessment:', error)
      }
    }
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadge = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-title">Interview Preparation</h1>
          <p className="text-muted-foreground mt-2">Practice with role-specific questions and get AI-powered feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Real-time AI feedback</span>
        </div>
      </div>

      <Tabs defaultValue="role-selection" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="role-selection">Select Role</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!selectedRole}>Quiz</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>Results</TabsTrigger>
          <TabsTrigger value="todos">Learning Plan</TabsTrigger>
        </TabsList>

        {/* Role Selection Tab */}
        <TabsContent value="role-selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Choose Your Target Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Select the role you want to prepare for. Our AI will generate questions based on real-time industry requirements and skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techRoles.map((role) => {
                  const roleHistory = quizHistory[role.id];
                  return (
                    <Card 
                      key={role.id}
                      className={`cursor-pointer transition-all hover:shadow-md relative ${
                        selectedRole === role.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      {roleHistory && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            <Brain className="h-3 w-3 mr-1" />
                            {roleHistory.attempts}x
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {role.icon}
                          <h3 className="font-semibold">{role.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {role.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {role.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                        {roleHistory && (
                          <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                            <Zap className="h-3 w-3" />
                            <span>AI questions available</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {selectedRole && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">Selected: {techRoles.find(r => r.id === selectedRole)?.name}</h4>
                      {quizHistory[selectedRole] ? (
                        <div className="flex items-center gap-2 mt-2">
                          <Brain className="h-4 w-4 text-purple-500" />
                          <p className="text-sm text-muted-foreground">
                            Previous attempts: {quizHistory[selectedRole].attempts} • 
                            <span className="text-purple-600 dark:text-purple-400 font-medium ml-1">
                              AI will generate fresh questions
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Ready to generate personalized questions</p>
                      )}
                    </div>
                    <Button onClick={generate} disabled={loading} className="ml-4">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {quizHistory[selectedRole] ? 'AI Generating...' : 'Generating...'}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {quizHistory[selectedRole] && <Brain className="h-4 w-4" />}
                          Start Quiz
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No questions generated yet. Please go back to role selection and start a quiz.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Progress</span>
                      {isAIGenerated && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Object.keys(answers).length}/{questions.length} completed
                    </span>
                  </div>
                  <Progress value={(Object.keys(answers).length / questions.length) * 100} />
                  {isAIGenerated && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                      ✨ These questions were dynamically generated by AI based on your role and previous attempts
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Questions */}
              {questions.map((q, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Question {idx + 1} of {questions.length}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{q.type}</Badge>
                        <Badge variant="secondary">{q.difficulty}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-4">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <label key={i} className={`flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                          answers[idx] === opt ? 'bg-primary/10 border-primary' : ''
                        }`}>
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            checked={answers[idx] === opt}
                            onChange={() => setAnswers((s) => ({ ...s, [idx]: opt }))}
                            className="text-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <Button 
                    onClick={submit} 
                    disabled={submitting || Object.keys(answers).length !== questions.length}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {submitting ? 'Analyzing Answers...' : 'Submit Quiz & Get AI Feedback'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Object.keys(answers).length === questions.length 
                      ? 'All questions answered! Ready to submit.' 
                      : `Please answer ${questions.length - Object.keys(answers).length} more question(s)`
                    }
                  </p>
                </CardContent>
              </Card>

            </>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {showResults && quizResults ? (
            <>
              {/* Score Overview */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Quiz Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 rounded-lg bg-muted/30 dark:bg-muted/20 relative overflow-hidden">
                      {((score / questions.length) * 100) >= 80 && (
                        <div className="absolute top-2 right-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
                        {score}/{questions.length}
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Final Score</p>
                      {((score / questions.length) * 100) >= 80 && (
                        <Badge className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Excellent!
                        </Badge>
                      )}
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 relative overflow-hidden">
                      {((score / questions.length) * 100) === 100 && (
                        <div className="absolute top-2 right-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {Math.round((score / questions.length) * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Accuracy Rate</p>
                      {((score / questions.length) * 100) === 100 && (
                        <Badge className="mt-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                          <Award className="h-3 w-3 mr-1" />
                          Perfect!
                        </Badge>
                      )}
                    </div>
                    <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {techRoles.find(r => r.id === selectedRole)?.name.split(' ')[0]}
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Target Role</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Overall Performance</span>
                      <span className="text-muted-foreground">{score} out of {questions.length} correct</span>
                    </div>
                    <Progress value={(score / questions.length) * 100} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle className="h-5 w-5" />
                      Correct Answers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{score}</div>
                    <p className="text-sm text-muted-foreground">
                      {score > 0 ? `Great job on ${score} question${score > 1 ? 's' : ''}!` : 'Keep practicing to improve your score.'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                      <XCircle className="h-5 w-5" />
                      Areas to Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{questions.length - score}</div>
                    <p className="text-sm text-muted-foreground">
                      {questions.length - score > 0 ? 'Focus on these topics for improvement.' : 'Perfect score! Excellent work!'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Question Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Detailed Question Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions.map((q, idx) => {
                    const isCorrect = q.correctAnswer === answers[idx]
                    return (
                      <div key={idx} className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${
                        isCorrect 
                          ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' 
                          : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full flex-shrink-0 ${
                            isCorrect 
                              ? 'bg-green-100 dark:bg-green-900/50' 
                              : 'bg-red-100 dark:bg-red-900/50'
                          }`}>
                            {isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-lg">Question {idx + 1}</span>
                              <Badge variant={isCorrect ? "default" : "destructive"} className="font-medium">
                                {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                              </Badge>
                              <Badge variant="outline" className="bg-background">
                                {q.type}
                              </Badge>
                              <Badge variant="secondary" className={`
                                ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                                ${q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                                ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                              `}>
                                {q.difficulty}
                              </Badge>
                            </div>
                            
                            <div className="bg-background/60 dark:bg-background/40 p-4 rounded-lg border">
                              <p className="font-medium text-foreground mb-3">{q.question}</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-green-700 dark:text-green-300">Correct Answer: </span>
                                  <span className="text-foreground">{q.correctAnswer}</span>
                                </div>
                              </div>
                              
                              {!isCorrect && (
                                <div className="flex items-start gap-2">
                                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <span className="font-medium text-red-700 dark:text-red-300">Your Answer: </span>
                                    <span className="text-foreground">{answers[idx] || 'Not answered'}</span>
                                  </div>
                                </div>
                              )}
                              
                              {q.explanation && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium text-blue-800 dark:text-blue-300">Explanation: </span>
                                      <span className="text-blue-700 dark:text-blue-200">{q.explanation}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {q.importantNotes && (
                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <span className="font-medium text-amber-800 dark:text-amber-300">Pro Tip: </span>
                                      <span className="text-amber-700 dark:text-amber-200">{q.importantNotes}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* AI Feedback */}
              {quizResults.feedback && (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      AI-Powered Feedback & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 p-5 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <h4 className="font-semibold text-purple-800 dark:text-purple-300">Overall Performance Analysis</h4>
                        </div>
                        <p className="text-purple-700 dark:text-purple-200 leading-relaxed">{quizResults.feedback.overall}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {quizResults.feedback.strengths && quizResults.feedback.strengths.length > 0 && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 p-5 rounded-xl">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/50">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <h4 className="font-semibold text-green-800 dark:text-green-300">Your Strengths</h4>
                            </div>
                            <ul className="space-y-3">
                              {quizResults.feedback.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-green-700 dark:text-green-200 text-sm leading-relaxed">{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {quizResults.feedback.improvements && quizResults.feedback.improvements.length > 0 && (
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 p-5 rounded-xl">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/50">
                                <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <h4 className="font-semibold text-orange-800 dark:text-orange-300">Growth Opportunities</h4>
                            </div>
                            <ul className="space-y-3">
                              {quizResults.feedback.improvements.map((improvement, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <Target className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-orange-700 dark:text-orange-200 text-sm leading-relaxed">{improvement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="p-4 rounded-full bg-muted/30 dark:bg-muted/20 w-fit mx-auto mb-4">
                    <CheckCircle className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground">Complete a quiz to see your detailed results and AI-powered feedback here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Learning Plan / Todos Tab */}
        <TabsContent value="todos" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Your Personalized Learning Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  <strong>AI-Generated Recommendations:</strong> Based on your quiz performance, we've created a personalized learning path to help you improve in areas that matter most for your target role.
                </p>
              </div>
              
              {todos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="p-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-fit mx-auto mb-6">
                      <BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Ready to Start Learning?</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Complete a quiz to unlock your personalized learning recommendations. Our AI will analyze your performance and create a tailored study plan just for you.
                    </p>
                    <div className="bg-muted/30 dark:bg-muted/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💡 Tip: Each quiz generates specific learning tasks based on the questions you missed
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Progress Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {todos.length}
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Tasks</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {todos.filter(t => t.completed).length}
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">Completed</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                        {todos.filter(t => !t.completed).length}
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Remaining</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Learning Progress</span>
                      <span className="text-muted-foreground">
                        {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}% Complete
                      </span>
                    </div>
                    <Progress 
                      value={(todos.filter(t => t.completed).length / todos.length) * 100} 
                      className="h-3"
                    />
                  </div>

                  {/* Filter by Priority */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                      High Priority: {todos.filter(t => t.priority === 'High' && !t.completed).length}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                      Medium Priority: {todos.filter(t => t.priority === 'Medium' && !t.completed).length}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Low Priority: {todos.filter(t => t.priority === 'Low' && !t.completed).length}
                    </Badge>
                  </div>

                  {/* Todo Items */}
                  <div className="space-y-4">
                    {todos
                      .sort((a, b) => {
                        // Sort by completion status first, then by priority
                        if (a.completed !== b.completed) return a.completed ? 1 : -1;
                        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                      })
                      .map((todo) => (
                        <div key={todo.id} className={`group relative overflow-hidden border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${
                          todo.completed 
                            ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800 opacity-75' 
                            : `bg-background border-border hover:border-primary/50 ${
                                todo.priority === 'High' ? 'border-l-4 border-l-red-500 dark:border-l-red-400' :
                                todo.priority === 'Medium' ? 'border-l-4 border-l-yellow-500 dark:border-l-yellow-400' :
                                'border-l-4 border-l-blue-500 dark:border-l-blue-400'
                              }`
                        }`}>
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => markTodoComplete(todo.id)}
                              className={`mt-1 p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                                todo.completed 
                                  ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                                  : 'bg-muted/50 dark:bg-muted/30 text-muted-foreground hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-600 dark:hover:text-green-400 hover:scale-110'
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <h4 className={`font-semibold text-lg leading-tight flex-1 ${
                                  todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {todo.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs font-medium ${
                                      todo.category === 'Deep Learning' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                                      todo.category === 'Machine Learning' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                                      todo.category === 'Statistics' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                                      'bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
                                    }`}
                                  >
                                    {todo.category}
                                  </Badge>
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs font-medium ${
                                      todo.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                      todo.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                    }`}
                                  >
                                    {todo.priority} Priority
                                  </Badge>
                                  <button
                                    onClick={() => deleteTodo(todo.id, todo.title)}
                                    className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete todo"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <p className={`text-sm leading-relaxed ${
                                todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                              }`}>
                                {todo.description}
                              </p>
                              
                              {todo.importantNotes && (
                                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-amber-700 dark:text-amber-200">
                                      <strong>Note:</strong> {todo.importantNotes}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {todo.relatedQuestion && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Related Question:</p>
                                  <p className="text-sm text-blue-700 dark:text-blue-200 italic">
                                    "{todo.relatedQuestion.length > 100 ? todo.relatedQuestion.substring(0, 100) + '...' : todo.relatedQuestion}"
                                  </p>
                                </div>
                              )}
                              
                              {todo.completedAt && (
                                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Completed on {new Date(todo.completedAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sidebar with Recent Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-3"></div>
        <div className="space-y-4">

          {/* Recent Assessments */}
          <Card className="border-primary/20 dark:border-primary/30">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
              <CardTitle className="flex items-center gap-2 text-primary dark:text-primary">
                <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20">
                  <Clock className="h-4 w-4" />
                </div>
                Recent Assessments
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {assessments.length === 0 ? (
                <div className="text-center py-6">
                  <div className="p-3 rounded-full bg-muted/30 dark:bg-muted/20 w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No assessments yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete a quiz to see your history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((assessment) => (
                    <div key={assessment.id} className="group flex items-center justify-between p-3 rounded-lg bg-muted/20 dark:bg-muted/10 border border-muted/50 dark:border-muted/30 hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{assessment.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(assessment.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getScoreBadge(assessment.quizScore, assessment.questions?.length || 10)} font-medium`}>
                          {assessment.quizScore}/{assessment.questions?.length || 10}
                        </Badge>
                        <button
                          onClick={() => deleteAssessment(assessment.id, assessment.category)}
                          className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete assessment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

