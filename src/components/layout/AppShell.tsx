import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type Role = 'govt' | 'ngo' | 'super'

const PAGE_TITLES: Record<string, string> = {
    '/gov/dashboard': 'Dashboard',
    '/gov/volunteers': 'Volunteer Management',
    '/gov/leaderboard': 'Volunteer Leaderboard',
    '/gov/alerts': 'Alert Broadcasting',
    '/gov/profile': 'Government Profile',
    '/gov/settings': 'Settings',
    '/ngo/dashboard': 'Dashboard',
    '/ngo/volunteers': 'Volunteer Management',
    '/ngo/leaderboard': 'Volunteer Leaderboard',
    '/ngo/profile': 'NGO Profile',
    '/ngo/settings': 'Settings',
    '/super/dashboard': 'Dashboard',
    '/super/ngo-management': 'NGO Management',
    '/super/registrations': 'Registration Approvals',
    '/super/moderation': 'User Moderation',
    '/super/audit-log': 'Audit Log',
    '/super/settings': 'Settings',
}

export function AppShell({ role }: { role: Role }) {
    const location = useLocation()
    const title = PAGE_TITLES[location.pathname] ?? 'Aidly Admin Portal'

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role={role} />
            <div className="flex flex-col flex-1 min-w-0">
                <TopBar role={role} title={title} />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
