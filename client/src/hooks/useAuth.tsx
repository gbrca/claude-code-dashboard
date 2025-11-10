import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, LoginRequest } from '@/types'
import { authApi } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('currentUser')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }

    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials)

    const userData: User = {
      username: response.username,
      email: response.email,
      role: response.role,
    }

    localStorage.setItem('authToken', response.token)
    localStorage.setItem('currentUser', JSON.stringify(userData))

    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
