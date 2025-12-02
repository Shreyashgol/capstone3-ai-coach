import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Interview() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [assessments, setAssessments] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [improvementTip, setImprovementTip] = useState('')
  const { headers } = useApiHeaders()

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/interview/assessments', { headers })
      const data = await res.json()
      setAssessments(data.assessments || [])
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
    }
  }

  const generate = async () => {
    setLoading(true)
    setScore(null)
    setAnswers({})
    setShowResults(false)
    try {
      const res = await fetch('/api/interview/generate-quiz', {
        method: 'POST',
        headers
      })
      const data = await res.json()
      setQuestions(Array.isArray(data.questions) ? data.questions : [])
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    const ansArray = questions.map((_, idx) => answers[idx] || null)
    const scoreCalc = questions.reduce((acc, q, idx) => acc + (q.correctAnswer === ansArray[idx] ? 1 : 0), 0)
    
    setSubmitting(true)
    try {
      const res = await fetch('/api/interview/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ questions, answers: ansArray, score: scoreCalc })
      })
      const result = await res.json()
      setScore(scoreCalc)
      setImprovementTip(result.improvementTip || '')
      setShowResults(true)
      fetchAssessments() // Refresh assessments
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score, total) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return 'bg-green-100 text-green-800'
    if (percentage >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-title">Interview Preparation</h1>
        <Button disabled={loading} onClick={generate}>
          {loading ? 'Generating...' : 'Generate New Quiz'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Section */}
        <div className="lg:col-span-2 space-y-4">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Ready to practice your interview skills? Generate a personalized quiz based on your industry and experience level.
                </p>
                <Button onClick={generate} disabled={loading}>
                  {loading ? 'Generating Questions...' : 'Start Interview Practice'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Questions */}
              {questions.map((q, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {idx + 1} of {questions.length}
                      <Badge variant="outline" className="ml-2">
                        {q.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium mb-4">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
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
                    {showResults && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                          <strong>Correct Answer:</strong> {q.correctAnswer}
                        </p>
                        {q.explanation && (
                          <p className="text-sm mt-1">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Submit Button */}
              {!showResults && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Button 
                      onClick={submit} 
                      disabled={submitting || Object.keys(answers).length !== questions.length}
                      size="lg"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {Object.keys(answers).length}/{questions.length} questions answered
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {showResults && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold ${getScoreColor(score, questions.length)}`}>
                        {score}/{questions.length}
                      </div>
                      <Progress value={(score / questions.length) * 100} className="mt-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round((score / questions.length) * 100)}% correct
                      </p>
                    </div>
                    
                    {improvementTip && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Improvement Tip</h4>
                        <p className="text-blue-700 text-sm">{improvementTip}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              {assessments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No assessments yet</p>
              ) : (
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{assessment.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getScoreBadge(assessment.quizScore, assessment.questions?.length || 10)}>
                        {assessment.quizScore}/{assessment.questions?.length || 10}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Practice the STAR method for behavioral questions</p>
              <p>• Research the company and role beforehand</p>
              <p>• Prepare specific examples from your experience</p>
              <p>• Ask thoughtful questions about the role</p>
              <p>• Practice technical concepts regularly</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

