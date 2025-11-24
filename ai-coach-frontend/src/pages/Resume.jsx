import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Resume() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [improving, setImproving] = useState(false)
  const [downloading, setDownloading] = useState(false)
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

  const downloadPdf = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/resume/pdf', { headers })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resume</h2>
      <div className="flex gap-2 mb-2">
        <Button onClick={save}>Save</Button>
        <Button disabled={improving} onClick={improveSelection}>{improving ? 'Improving...' : 'Improve selection with AI'}</Button>
        <Button disabled={downloading} onClick={downloadPdf}>{downloading ? 'Generating PDF...' : 'Download PDF'}</Button>
      </div>
      <textarea className="w-full h-[400px] border rounded-md p-3" value={content} onChange={(e) => setContent(e.target.value)} />
    </div>
  )
}

