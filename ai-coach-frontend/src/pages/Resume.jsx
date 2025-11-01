import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Resume() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [improving, setImproving] = useState(false)
  const { headers } = useApiHeaders()

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/resume', { headers })
        const data = await res.json()
        setContent(data?.content || '')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const save = async () => {
    await fetch('/api/resume/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ content })
    })
  }

  const improveSelection = async () => {
    const selection = window.getSelection().toString()
    if (!selection) return
    setImproving(true)
    try {
      const res = await fetch('/api/resume/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ current: selection, type: 'experience' })
      })
      const data = await res.json()
      if (data?.improved) setContent((c) => c.replace(selection, data.improved))
    } finally {
      setImproving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resume</h2>
      <div className="flex gap-2 mb-2">
        <Button onClick={save}>Save</Button>
        <Button disabled={improving} onClick={improveSelection}>{improving ? 'Improving...' : 'Improve selection with AI'}</Button>
      </div>
      <textarea className="w-full h-[400px] border rounded-md p-3" value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
  )
}

