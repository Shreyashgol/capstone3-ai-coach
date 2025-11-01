import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function UserSync() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !user) return
      
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl || ''
          })
        })
      } catch (error) {
        console.error('User sync failed:', error)
      }
    }
    run()
  }, [isAuthenticated, user])

  return null
}

