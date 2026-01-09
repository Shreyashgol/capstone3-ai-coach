import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [theme, setTheme] = useState(() => {

    const stored = localStorage.getItem('theme')
    if (stored) return stored
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    root.classList.remove('light', 'dark')
    
    root.classList.add(theme)

    localStorage.setItem('theme', theme)
    
    if (isAuthenticated && user?.id) {
      syncThemeWithBackend(theme)
    }
  }, [theme, isAuthenticated, user])

  const syncThemeWithBackend = async (newTheme) => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      await fetch(`${baseURL}/api/user/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ theme: newTheme }),
      })
    } catch (error) {
      console.error('Failed to sync theme with backend:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserThemePreference()
    }
  }, [isAuthenticated, user])

  const loadUserThemePreference = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001'
      const response = await fetch(`${baseURL}/api/user/preferences`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        if (data.theme && data.theme !== theme) {
          setTheme(data.theme)
        }
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error)
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
