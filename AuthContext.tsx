import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from '../utils/supabase/info'

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

interface User {
  id: string
  email: string
  name: string
  company: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string, company: string) => Promise<boolean>
  loading: boolean
  accessToken: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.log('Session check error:', error.message)
        setLoading(false)
        return
      }
      
      if (session?.access_token) {
        setAccessToken(session.access_token)
        await fetchUserProfile(session.access_token)
      }
    } catch (error) {
      console.log('Session check process error:', error)
    }
    setLoading(false)
  }

  async function fetchUserProfile(token: string) {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const profileData = await response.json()
        setUser(profileData)
      } else {
        console.log('Failed to fetch user profile:', await response.text())
      }
    } catch (error) {
      console.log('Profile fetch error:', error)
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.log('Login error:', error.message)
        return false
      }
      
      if (data.session?.access_token) {
        setAccessToken(data.session.access_token)
        await fetchUserProfile(data.session.access_token)
        return true
      }
      
      return false
    } catch (error) {
      console.log('Login process error:', error)
      return false
    }
  }

  async function signup(email: string, password: string, name: string, company: string): Promise<boolean> {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-1b7356ff/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email, password, name, company })
      })
      
      if (response.ok) {
        // After successful signup, login automatically
        return await login(email, password)
      } else {
        const errorData = await response.json()
        console.log('Signup error:', errorData.error)
        return false
      }
    } catch (error) {
      console.log('Signup process error:', error)
      return false
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setAccessToken(null)
    } catch (error) {
      console.log('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, accessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}