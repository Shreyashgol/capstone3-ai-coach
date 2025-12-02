import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function CoverLetterDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'error', 'info'
  const { headers } = useApiHeaders()

  useEffect(() => {
    console.log('=== USEEFFECT TRIGGERED ===')
    console.log('Cover letter ID:', id)
    console.log('Headers:', headers)
    
    if (!id) {
      console.error('No ID provided')
      showMessage('Invalid cover letter ID', 'error')
      setLoading(false)
      return
    }
    
    const fetchCoverLetter = async () => {
      try {
        console.log('=== FETCHING COVER LETTER ===')
        const res = await fetch(`/api/cover-letters/${id}`, { headers })
        console.log('Fetch response status:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('=== FETCH SUCCESS ===')
          console.log('Response data:', data)
          
          if (data.coverLetter) {
            console.log('Setting item and content:', data.coverLetter.content.substring(0, 100))
            setItem(data.coverLetter)
            setContent(data.coverLetter.content)
          } else {
            console.error('No cover letter in response:', data)
            showMessage('Cover letter not found', 'error')
          }
        } else {
          const errorData = await res.json()
          console.error('=== FETCH ERROR ===')
          console.error('Error response:', errorData)
          showMessage(errorData.error || 'Failed to load cover letter', 'error')
        }
      } catch (error) {
        console.error('=== FETCH EXCEPTION ===', error)
        showMessage('Failed to load cover letter', 'error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCoverLetter()
  }, [id]) // Removed headers dependency to avoid unnecessary re-fetches

  // Sync content when item changes (but not when editing)
  useEffect(() => {
    if (item && !editing) {
      console.log('=== SYNCING CONTENT WITH ITEM ===')
      console.log('Item content:', item.content?.substring(0, 100))
      setContent(item.content)
    }
  }, [item, editing])

  const showMessage = (text, type = 'info') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 4000)
  }

  const handleSave = async () => {
    console.log('=== SAVE FUNCTION CALLED ===')
    console.log('Current content:', content)
    console.log('Content length:', content.length)
    console.log('Original item content:', item?.content)
    
    if (!content.trim()) {
      showMessage('Please add some content before saving', 'error')
      return
    }
    
    setSaving(true)
    showMessage('Saving cover letter...', 'info')
    
    try {
      console.log('=== MAKING API REQUEST ===')
      console.log('Cover letter ID:', id)
      console.log('Request body:', { content })
      console.log('Headers:', headers)
      
      const res = await fetch(`/api/cover-letters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ content: content.trim() })
      })
      
      console.log('=== API RESPONSE ===')
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Response data:', data)
        
        if (data.coverLetter) {
          console.log('=== UPDATING STATE ===')
          console.log('New content from server:', data.coverLetter.content)
          setItem(data.coverLetter)
          setContent(data.coverLetter.content) // Update content state with server response
          setEditing(false)
          showMessage('Cover letter saved successfully! ✅', 'success')
        } else {
          console.error('No coverLetter in response:', data)
          showMessage('Failed to save cover letter - no data returned', 'error')
        }
      } else {
        const errorData = await res.json()
        console.error('Save error response:', errorData)
        showMessage(errorData.error || 'Failed to save cover letter', 'error')
      }
    } catch (error) {
      console.error('=== SAVE ERROR ===', error)
      showMessage('Failed to save cover letter. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmMessage = `Are you sure you want to delete the cover letter for "${item.jobTitle}" at "${item.companyName}"? This action cannot be undone.`
    if (!confirm(confirmMessage)) return
    
    setDeleting(true)
    showMessage('Deleting cover letter...', 'info')
    
    try {
      console.log('Deleting cover letter ID:', id)
      
      const res = await fetch(`/api/cover-letters/${id}`, {
        method: 'DELETE',
        headers
      })
      
      console.log('Delete response status:', res.status)
      
      if (res.ok) {
        showMessage('Cover letter deleted successfully', 'success')
        setTimeout(() => {
          navigate('/cover-letters')
        }, 1000)
      } else {
        const errorData = await res.json()
        console.error('Delete error response:', errorData)
        showMessage(errorData.error || 'Failed to delete cover letter', 'error')
      }
    } catch (error) {
      console.error('Failed to delete cover letter:', error)
      showMessage('Failed to delete cover letter. Please try again.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      showMessage('Cover letter copied to clipboard! 📋', 'success')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (!item) return <div className="text-center">Cover letter not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/cover-letters" className="text-sm text-muted-foreground hover:underline">
            ← Back to Cover Letters
          </Link>
          <h1 className="text-3xl font-bold mt-2">
            {item.jobTitle} @ {item.companyName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyToClipboard}>
            Copy
          </Button>
          {editing ? (
            <>
              <Button variant="outline" onClick={() => {
                console.log('=== CANCEL BUTTON CLICKED ===')
                console.log('Resetting content to:', item?.content)
                setEditing(false)
                setContent(item.content) // Reset content to original
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => {
                console.log('=== EDIT BUTTON CLICKED ===')
                console.log('Current content before edit:', content)
                console.log('Item content:', item?.content)
                setEditing(true)
              }}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
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

      {/* Debug Info - Remove this after debugging */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div><strong>Editing:</strong> {editing ? 'Yes' : 'No'}</div>
            <div><strong>Content Length:</strong> {content?.length || 0}</div>
            <div><strong>Item Content Length:</strong> {item?.content?.length || 0}</div>
            <div><strong>Content Preview:</strong> {content?.substring(0, 50)}...</div>
            <div><strong>Item Content Preview:</strong> {item?.content?.substring(0, 50)}...</div>
            <div><strong>Cover Letter ID:</strong> {id}</div>
            <div><strong>Has Headers:</strong> {Object.keys(headers).length > 0 ? 'Yes' : 'No'}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Content</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <textarea
              value={content}
              onChange={(e) => {
                console.log('Textarea onChange triggered, new value length:', e.target.value.length)
                console.log('New value preview:', e.target.value.substring(0, 100) + '...')
                setContent(e.target.value)
              }}
              className="w-full h-96 p-4 border rounded-md font-mono text-sm resize-none"
              placeholder="Enter your cover letter content..."
            />
          ) : (
            <div className="whitespace-pre-wrap font-mono text-sm bg-muted/30 p-4 rounded-md">
              {content}
            </div>
          )}
        </CardContent>
      </Card>

      {item.jobDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {item.jobDescription}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

