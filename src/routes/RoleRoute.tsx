import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Maps DB role values to frontend role keys
const roleAliases: Record<string, string> = {
  super: 'super',
  super_admin: 'super',
  govt: 'govt',
  govt_admin: 'govt',
  ngo: 'ngo',
  ngo_admin: 'ngo',
  volunteer: 'volunteer',
}

interface Props {
  allowedRoles: string[]
  children: any
}

export default function RoleRoute({ allowedRoles, children }: Props) {
  const { role, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )

  const normalised = roleAliases[role ?? ''] ?? role

  if (!normalised || !allowedRoles.includes(normalised)) {
    return <Navigate to="/roles" replace />
  }

  return children
}