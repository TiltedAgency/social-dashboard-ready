import { AuthProvider, useAuth } from "./components/AuthContext"
import { AuthForm } from "./components/AuthForm"
import { EnhancedDashboard } from "./components/EnhancedDashboard"

function AppContent() {
  const { user, loading } = useAuth()

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

  // Temporarily bypass auth to show dashboard for styling
  return <EnhancedDashboard />
  
  // Original auth logic (commented out temporarily)
  // return user ? <EnhancedDashboard /> : <AuthForm />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}