import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App.jsx'
import CoverLetters from './pages/CoverLetters.jsx'
import Interview from './pages/Interview.jsx'
import Onboarding from './pages/Onboarding.jsx'
import EnhancedDashboard from './pages/EnhancedDashboard.jsx'
import Resume from './pages/Resume.jsx'
import CoverLetterDetail from './pages/CoverLetterDetail.jsx'
import SignInPage from './pages/auth/SignIn.jsx'
import SignUpPage from './pages/auth/SignUp.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/auth/signin', element: <SignInPage /> },
      { path: '/auth/signup', element: <SignUpPage /> },
      { 
        path: '/onboarding', 
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/dashboard', 
        element: (
          <ProtectedRoute>
            <EnhancedDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/resume', 
        element: (
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/cover-letters', 
        element: (
          <ProtectedRoute>
            <CoverLetters />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/cover-letters/:id', 
        element: (
          <ProtectedRoute>
            <CoverLetterDetail />
          </ProtectedRoute>
        ) 
      },
      { 
        path: '/interview', 
        element: (
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        ) 
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)

