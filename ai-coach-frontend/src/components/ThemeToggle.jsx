import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <Button 
      variant="outline" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="relative overflow-hidden group"
    >
      <div className="relative w-4 h-4">
        <Sun className={`h-4 w-4 absolute transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0'
        }`} />
        <Moon className={`h-4 w-4 absolute transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
    </Button>
  )
}

