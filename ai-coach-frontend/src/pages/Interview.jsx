import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Interview() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const { headers } = useApiHeaders()

  const generate = async () => {
    setLoading(true)
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
    setScore(scoreCalc)
    await fetch('/api/interview/save-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ questions, answers: ansArray, score: scoreCalc })
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Interview Quiz</h2>
      <Button disabled={loading} onClick={generate}>
        {loading ? 'Loading...' : 'Generate Quiz'}
      </Button>
      {questions.map((q, idx) => (
        <div key={idx} className="mt-4 p-4 border rounded-md">
          <div className="font-medium">Q{idx + 1}. {q.question}</div>
          <div className="grid gap-2 mt-2">
            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  checked={answers[idx] === opt}
                  onChange={() => setAnswers((s) => ({ ...s, [idx]: opt }))}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      {questions.length > 0 && (
        <Button className="mt-4" onClick={submit}>Submit</Button>
      )}
      {score !== null && <p className="mt-2">Score: {score}/{questions.length}</p>}
    </div>
  )
}

