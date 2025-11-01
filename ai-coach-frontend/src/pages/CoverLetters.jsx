import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function CoverLetters() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', companyName: '', jobDescription: '' })
  const { headers } = useApiHeaders()

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/cover-letters', { headers })
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch {}
    }
    run()
  }, [])

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/cover-letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form)
      })
      const created = await res.json()
      if (created && created.id) setItems((prev) => [created, ...prev])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Cover Letters</h2>
      <form onSubmit={generate} className="grid gap-3 max-w-xl mb-8">
        <Input placeholder="Job title" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
        <Input placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        <textarea className="border rounded-md p-3 min-h-32" placeholder="Job description" value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })} />
        <Button disabled={loading}>{loading ? 'Generating...' : 'Generate'}</Button>
      </form>
      <ul className="grid gap-4">
        {items.map((it) => (
          <li key={it.id} className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{it.jobTitle} @ {it.companyName}</div>
                <div className="text-sm text-muted-foreground">{new Date(it.createdAt).toLocaleString()}</div>
              </div>
              <Link to={`/cover-letters/${it.id}`} className="underline">Open</Link>
            </div>
            <div className="mt-2 whitespace-pre-wrap text-sm">{it.content?.slice(0, 220)}...</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

