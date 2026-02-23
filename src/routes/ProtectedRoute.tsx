import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }: any) {
  const { user, loading, isSuspended } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )

  if (!user) return <Navigate to="/roles" replace />

  if (isSuspended) return <Navigate to="/pending" replace />

  return children
}