import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, signOut as supabaseSignOut, type DBUser } from '../lib/supabase'

interface AuthState {
  user: any
  dbUser: DBUser | null
  role: string | null
  loading: boolean
  isSuspended: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)
  const [dbUser, setDbUser] = useState<DBUser | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSuspended, setIsSuspended] = useState(false)

  const fetchUserRow = async (authUserId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single()
    if (data) {
      setDbUser(data)
      setRole(data.role)
      setIsSuspended(data.is_suspended ?? false)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchUserRow(session.user.id)
      } else {
        setUser(null)
        setDbUser(null)
        setRole(null)
        setIsSuspended(false)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabaseSignOut()
    setUser(null)
    setDbUser(null)
    setRole(null)
    setIsSuspended(false)
  }

  return (
    <AuthContext.Provider value={{ user, dbUser, role, loading, isSuspended, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)!
}