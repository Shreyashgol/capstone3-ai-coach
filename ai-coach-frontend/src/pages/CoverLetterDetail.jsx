import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiHeaders } from '@/hooks/useApiHeaders'

export default function CoverLetterDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const { headers } = useApiHeaders()

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`/api/cover-letters/${id}`, { headers })
      const data = await res.json()
      setItem(data)
    }
    run()
  }, [id, headers])

  if (!item) return <div style={{ padding: 24 }}>Loading...</div>
  return (
    <div style={{ padding: 24 }}>
      <h2>{item.jobTitle} @ {item.companyName}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{item.content}</pre>
    </div>
  )
}

