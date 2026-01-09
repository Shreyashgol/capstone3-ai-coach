import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import UserSync from '@/components/UserSync'

export default function RootLayout() {
  return (
    <>
      <Header />
      <UserSync />
      <main className="container mx-auto px-4 pt-24 pb-12 theme-transition">
        <Outlet />
      </main>
      <footer className="bg-muted/50 py-12 border-t theme-transition">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
        </div>
      </footer>
    </>
  )
}

