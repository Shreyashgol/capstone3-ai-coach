import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Resume() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [improving, setImproving] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [atsData, setAtsData] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'error', 'info'
  const { headers } = useApiHeaders()

  useEffect(() => {
    console.log('Resume page loaded, headers:', headers)
    const run = async () => {
      try {
        const res = await fetch('/api/resume', { headers })
        const data = await res.json()
        console.log('Resume data loaded:', data)
        setContent(data?.content || '')
        if (data?.atsScore) {
          setAtsData({
            atsScore: data.atsScore,
            feedback: data.feedback
          })
        }
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 3000)
  }

  const save = async () => {
    if (!content.trim()) {
      showMessage('Please add some content to save', 'error')
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ content })
      })
      
      if (res.ok) {
        showMessage('Resume saved successfully! ✅', 'success')
      } else {
        const errorData = await res.json()
        showMessage(errorData.error || 'Failed to save resume', 'error')
      }
    } catch (error) {
      console.error('Save error:', error)
      showMessage('Failed to save resume. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const improveSelection = async () => {
    const selection = window.getSelection().toString().trim()
    console.log('Selected text:', selection)
    
    if (!selection) {
      showMessage('Please select text to improve', 'error')
      return
    }
    
    if (selection.length < 10) {
      showMessage('Please select more text (at least 10 characters)', 'error')
      return
    }
    
    setImproving(true)
    showMessage('AI is improving your selected text...', 'info')
    
    try {
      console.log('Making improve request with headers:', headers)
      const res = await fetch('/api/resume/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ current: selection, type: 'experience' })
      })
      
      console.log('Improve response status:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Improve response data:', data)
        if (data?.improved) {
          setContent((c) => c.replace(selection, data.improved))
          showMessage('Text improved successfully! ✨', 'success')
        } else {
          showMessage('No improvements suggested for this text', 'info')
        }
      } else {
        const errorData = await res.json()
        console.error('Improve error response:', errorData)
        showMessage(errorData.error || 'Failed to improve text', 'error')
      }
    } catch (error) {
      console.error('Improve error:', error)
      showMessage('Failed to improve text. Please try again.', 'error')
    } finally {
      setImproving(false)
    }
  }

  const analyzeATS = async () => {
    if (!content.trim()) {
      showMessage('Please add resume content first', 'error')
      return
    }
    
    if (content.length < 100) {
      showMessage('Please add more content for accurate ATS analysis', 'error')
      return
    }
    
    setAnalyzing(true)
    showMessage('AI is analyzing your resume for ATS compatibility...', 'info')
    
    try {
      console.log('Making ATS request with headers:', headers)
      const res = await fetch('/api/resume/ats-score', { headers })
      
      console.log('ATS response status:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('ATS response data:', data)
        setAtsData(data)
        showMessage(`ATS analysis complete! Score: ${data.atsScore}/100`, 'success')
      } else {
        const errorData = await res.json()
        console.error('ATS error response:', errorData)
        showMessage(errorData.error || 'Failed to analyze resume', 'error')
      }
    } catch (error) {
      console.error('ATS analysis error:', error)
      showMessage('Failed to analyze resume. Please try again.', 'error')
    } finally {
      setAnalyzing(false)
    }
  }

  const downloadPdf = async () => {
    if (!content.trim()) {
      showMessage('Please add resume content first', 'error')
      return
    }
    
    setDownloading(true)
    showMessage('Generating PDF...', 'info')
    
    try {
      const res = await fetch('/api/resume/pdf', { headers })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'resume.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
        showMessage('PDF downloaded successfully! 📄', 'success')
      } else {
        const errorData = await res.json()
        showMessage(errorData.error || 'Failed to generate PDF', 'error')
      }
    } catch (error) {
      console.error('PDF download error:', error)
      showMessage('Failed to download PDF. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-title">Resume Builder</h1>
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button disabled={improving} onClick={improveSelection}>
            {improving ? 'Improving...' : 'Improve Selection'}
          </Button>
          <Button disabled={analyzing} onClick={analyzeATS}>
            {analyzing ? 'Analyzing...' : 'ATS Score'}
          </Button>
          <Button disabled={downloading} onClick={downloadPdf}>
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <p className="font-medium">{message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resume Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resume Content</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full h-[500px] border rounded-md p-3 font-mono text-sm" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your resume content here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* ATS Analysis */}
        <div className="space-y-4">
          {atsData && (
            <Card>
              <CardHeader>
                <CardTitle>ATS Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {atsData.atsScore}/100
                  </div>
                  <Progress value={atsData.atsScore} className="w-full" />
                </div>
                
                {atsData.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback</h4>
                    <p className="text-sm text-muted-foreground">{atsData.feedback}</p>
                  </div>
                )}

                {atsData.strengths && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                    <ul className="text-sm space-y-1">
                      {atsData.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {atsData.improvements && (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Improvements</h4>
                    <ul className="text-sm space-y-1">
                      {atsData.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Select text and click "Improve Selection" for AI suggestions</p>
              <p>• Use industry keywords for better ATS scores</p>
              <p>• Keep formatting simple and clean</p>
              <p>• Quantify achievements with numbers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

