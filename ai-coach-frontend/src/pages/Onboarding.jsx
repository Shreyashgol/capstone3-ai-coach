import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function Onboarding() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ industry: '', experience: 0, bio: '', skills: '' })
  const { headers } = useApiHeaders()

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/user/onboarding-status', { headers })
        const data = await res.json()
        if (data?.isOnboarded) nav('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [nav])

  const submit = async (e) => {
    e.preventDefault()
    const payload = {
      industry: form.industry,
      experience: Number(form.experience) || 0,
      bio: form.bio,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    }
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload)
    })
    if (res.ok) nav('/dashboard')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Onboarding</h2>
      <form onSubmit={submit} className="grid gap-3">
        <Input placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        <Input type="number" placeholder="Years of experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <textarea className="border rounded-md p-3 min-h-24" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <Input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <Button>Continue</Button>
      </form>
    </div>
  )
}

