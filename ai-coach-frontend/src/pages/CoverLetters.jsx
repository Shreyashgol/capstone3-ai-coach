import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApiHeaders } from '@/hooks/useApiHeaders'
import { Trash2, MoreVertical } from 'lucide-react'

export default function CoverLetters() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', companyName: '', jobDescription: '' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success', 'error', 'info'
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [deletingItems, setDeletingItems] = useState([])
  const { headers } = useApiHeaders()

  useEffect(() => {
    console.log('Cover letters page loaded, headers:', headers)
    const run = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
        const res = await fetch(`${baseURL}/api/cover-letters`, { headers })
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
      
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const res = await fetch(`${baseURL}/api/cover-letters/generate`, {
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

  const deleteCoverLetter = async (id, jobTitle, companyName) => {
    if (window.confirm(`Are you sure you want to delete the cover letter for "${jobTitle}" at "${companyName}"?`)) {
      setDeletingItems(prev => [...prev, id])
      try {
        const res = await fetch(`/api/cover-letters/${id}`, {
          method: 'DELETE',
          headers
        })
        
        if (res.ok) {
          setItems((prev) => prev.filter(item => item.id !== id))
          setSelectedItems((prev) => prev.filter(itemId => itemId !== id))
          showMessage('Cover letter deleted successfully', 'success')
        } else {
          const errorData = await res.json()
          showMessage(errorData.error || 'Failed to delete cover letter', 'error')
        }
      } catch (error) {
        console.error('Delete error:', error)
        showMessage('Failed to delete cover letter. Please try again.', 'error')
      } finally {
        setDeletingItems(prev => prev.filter(itemId => itemId !== id))
      }
    }
  }

  const bulkDeleteCoverLetters = async () => {
    if (selectedItems.length === 0) return
    
    const confirmMessage = `Are you sure you want to delete ${selectedItems.length} cover letter${selectedItems.length > 1 ? 's' : ''}? This action cannot be undone.`
    if (!window.confirm(confirmMessage)) return
    
    setBulkDeleting(true)
    showMessage(`Deleting ${selectedItems.length} cover letter${selectedItems.length > 1 ? 's' : ''}...`, 'info')
    
    try {
      const deletePromises = selectedItems.map(id => 
        fetch(`/api/cover-letters/${id}`, {
          method: 'DELETE',
          headers
        })
      )
      
      const results = await Promise.allSettled(deletePromises)
      const successful = results.filter(result => result.status === 'fulfilled' && result.value.ok).length
      const failed = selectedItems.length - successful
      
      if (successful > 0) {
        setItems((prev) => prev.filter(item => !selectedItems.includes(item.id)))
        setSelectedItems([])
      }
      
      if (failed === 0) {
        showMessage(`Successfully deleted ${successful} cover letter${successful > 1 ? 's' : ''}`, 'success')
      } else {
        showMessage(`Deleted ${successful} cover letter${successful > 1 ? 's' : ''}, failed to delete ${failed}`, 'error')
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      showMessage('Failed to delete cover letters. Please try again.', 'error')
    } finally {
      setBulkDeleting(false)
    }
  }

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === items.length ? [] : items.map(item => item.id)
    )
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Cover Letters</h2>
          {items.length > 0 && (
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selectedItems.length} selected
                  </span>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={bulkDeleteCoverLetters}
                    disabled={bulkDeleting}
                  >
                    {bulkDeleting ? 'Deleting...' : `Delete ${selectedItems.length}`}
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSelectAll}
              >
                {selectedItems.length === items.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          )}
        </div>
        
        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No cover letters yet. Generate your first one above!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className={`group hover:shadow-md transition-all duration-200 ${
                selectedItems.includes(item.id) ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />
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
                      <button
                        onClick={() => deleteCoverLetter(item.id, item.jobTitle, item.companyName)}
                        disabled={deletingItems.includes(item.id)}
                        className={`p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${
                          deletingItems.includes(item.id) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={`Delete cover letter for ${item.jobTitle} at ${item.companyName}`}
                      >
                        {deletingItems.includes(item.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-3 ml-6">
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

