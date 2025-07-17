import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/Dashboard'
import AvailabilitySettings from './pages/AvailabilitySettings'
import PublicBooking from './pages/PublicBooking'
import Appointments from './pages/Appointments'
import Navigation from './components/Navigation'

// Protected routes component that requires authentication
function ProtectedApp({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/availability" element={<AvailabilitySettings user={user} />} />
          <Route path="/appointments" element={<Appointments user={user} />} />
        </Routes>
      </main>
    </div>
  )
}

// Login page component
function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to CalendlyClone</h1>
        <p className="text-muted-foreground mb-6">
          Streamline your scheduling with our simple appointment booking system.
        </p>
        <button
          onClick={() => blink.auth.login()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Sign In to Get Started
        </button>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public booking route - no authentication required */}
        <Route path="/book/:userId" element={<PublicBooking />} />
        
        {/* Protected routes - authentication required */}
        <Route path="/*" element={
          user ? (
            <ProtectedApp user={user} />
          ) : (
            <LoginPage />
          )
        } />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App