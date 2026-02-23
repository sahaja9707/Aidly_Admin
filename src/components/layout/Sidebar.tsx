import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
    LayoutDashboard, Bell, Users, Trophy, FileText, Settings,
    CheckSquare, Shield, ClipboardList, Building2, LogOut
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Role = 'govt' | 'ngo' | 'super'

interface NavItem {
    label: string
    icon: React.ElementType
    to: string
}

const govNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/gov/dashboard' },
    { label: 'Volunteers', icon: Users, to: '/gov/volunteers' },
    { label: 'Leaderboard', icon: Trophy, to: '/gov/leaderboard' },
    { label: 'Alerts', icon: Bell, to: '/gov/alerts' },
    { label: 'Profile', icon: FileText, to: '/gov/profile' },
    { label: 'Settings', icon: Settings, to: '/gov/settings' },
]

const ngoNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/ngo/dashboard' },
    { label: 'Volunteers', icon: Users, to: '/ngo/volunteers' },
    { label: 'Leaderboard', icon: Trophy, to: '/ngo/leaderboard' },
    { label: 'Profile', icon: FileText, to: '/ngo/profile' },
    { label: 'Settings', icon: Settings, to: '/ngo/settings' },
]

const superNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/super/dashboard' },
    { label: 'NGO Management', icon: Building2, to: '/super/ngo-management' },
    { label: 'Registrations', icon: CheckSquare, to: '/super/registrations' },
    { label: 'Moderation', icon: Shield, to: '/super/moderation' },
    { label: 'Audit Log', icon: ClipboardList, to: '/super/audit-log' },
    { label: 'Settings', icon: Settings, to: '/super/settings' },
]

const roleLabels: Record<Role, string> = {
    govt: 'Government Admin',
    ngo: 'NGO Admin',
    super: 'Super Admin',
}

const roleBadgeVariant: Record<Role, 'default' | 'secondary' | 'outline'> = {
    govt: 'default',
    ngo: 'secondary',
    super: 'outline',
}

export function Sidebar({ role }: { role: Role }) {
    const location = useLocation()
    const navItems = role === 'govt' ? govNav : role === 'ngo' ? ngoNav : superNav

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen border-r bg-card">
            {/* Logo */}
            <div className="flex items-center gap-2 px-6 py-5 border-b">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">A</span>
                </div>
                <div>
                    <p className="text-sm font-semibold tracking-tight">Aidly</p>
                    <p className="text-xs text-muted-foreground">Admin Portal</p>
                </div>
            </div>

            {/* Role badge */}
            <div className="px-4 pt-4 pb-2">
                <Badge variant={roleBadgeVariant[role]} className="w-full justify-center text-xs py-1">
                    {roleLabels[role]}
                </Badge>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.label}
                        </NavLink>
                    )
                })}
            </nav>

            <Separator />

            {/* Logout */}
            <div className="px-3 py-4">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </NavLink>
            </div>
        </aside>
    )
}
