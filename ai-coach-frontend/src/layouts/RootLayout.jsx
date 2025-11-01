import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import { useEffect } from 'react'
import UserSync from '@/components/UserSync'

export default function RootLayout() {
  useEffect(() => {
    const pref = localStorage.getItem('theme')
    const root = document.documentElement
    if (!pref) root.classList.add('dark')
  }, [])
  return (
    <>
      <Header />
      <UserSync />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Outlet />
      </main>
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          <p>Made with 💗 by AlgoCoder</p>
        </div>
      </footer>
    </>
  )
}

