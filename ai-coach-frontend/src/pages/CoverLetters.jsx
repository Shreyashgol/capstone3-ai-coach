import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function CoverLetters() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', companyName: '', jobDescription: '' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'error', 'info'
  const { headers } = useApiHeaders()

  useEffect(() => {
    console.log('Cover letters page loaded, headers:', headers)
    const run = async () => {
      try {
        const res = await fetch('/api/cover-letters', { headers })
        const data = await res.json()
        console.log('Cover letters data:', data)
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.coverLetters)
            ? data.coverLetters
            : []
        setItems(list)
      } catch (error) {
        console.error('Failed to fetch cover letters:', error)
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
    }, 4000)
  }

  const generate = async (e) => {
    e.preventDefault()
    if (!form.jobTitle || !form.companyName) {
      showMessage('Please fill in job title and company name', 'error')
      return
    }
    
    setLoading(true)
    showMessage('AI is generating your cover letter...', 'info')
    
    try {
      console.log('Generating cover letter with data:', form)
      console.log('Using headers:', headers)
      
      const res = await fetch('/api/cover-letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form)
      })
      
      console.log('Generate response status:', res.status)
      
      if (res.ok) {
        const created = await res.json()
        console.log('Generated cover letter:', created)
        
        if (created && created.id) {
          setItems((prev) => [created, ...prev])
          setForm({ jobTitle: '', companyName: '', jobDescription: '' })
          showMessage('Cover letter generated successfully! ✨', 'success')
        } else {
          showMessage('Failed to generate cover letter', 'error')
        }
      } else {
        const errorData = await res.json()
        console.error('Generate error response:', errorData)
        showMessage(errorData.error || 'Failed to generate cover letter', 'error')
      }
    } catch (error) {
      console.error('Generate error:', error)
      showMessage('Failed to generate cover letter. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-title">Cover Letters</h1>
        <div className="text-sm text-muted-foreground">
          {items.length} cover letter{items.length !== 1 ? 's' : ''}
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

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Cover Letter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generate} className="grid gap-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Job title (e.g., Software Engineer)" 
                value={form.jobTitle} 
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                required
              />
              <Input 
                placeholder="Company name" 
                value={form.companyName} 
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
              />
            </div>
            <textarea 
              className="border rounded-md p-3 min-h-32 resize-none" 
              placeholder="Job description (optional - helps create more targeted cover letter)" 
              value={form.jobDescription} 
              onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} 
            />
            <Button disabled={loading} className="w-fit">
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Cover Letters List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Cover Letters</h2>
        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No cover letters yet. Generate your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.jobTitle} @ {item.companyName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <Link to={`/cover-letters/${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {item.content?.slice(0, 200)}...
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

