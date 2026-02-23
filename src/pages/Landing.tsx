import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Building2, Star } from 'lucide-react'

const roles = [
    {
        id: 'govt',
        label: 'Government Admin',
        description: 'Manage certified volunteers, broadcast official disaster alerts, and maintain government profile.',
        icon: Shield,
        badge: 'Official',
        features: ['Volunteer certification control', 'Disaster alert broadcasting', 'Official announcements'],
        path: '/gov-admin-hub',
    },
    {
        id: 'ngo',
        label: 'NGO Admin',
        description: 'Manage your NGO volunteer network, approve join requests, and view your organisation profile.',
        icon: Building2,
        badge: 'Partner',
        features: ['Volunteer management', 'Join request approvals', 'Campaign oversight'],
        path: '/ngo-admin-hub',
    },
    {
        id: 'super',
        label: 'Super Admin',
        description: 'Full platform control — approve registrations, moderate users, manage NGOs, and monitor the system.',
        icon: Star,
        badge: 'Aidly Core',
        features: ['Global moderation', 'NGO registry management', 'Platform analytics'],
        path: '/roles',
    },
]

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">A</span>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Aidly Admin Portal</p>
                        <p className="text-xs text-muted-foreground">Governance & Verification Platform</p>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <div className="text-center mb-12 max-w-xl">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Aidly Admin Portal
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        A role-based governance platform for disaster response coordination.
                        Select your role to continue.
                    </p>
                </div>

                {/* Role cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {roles.map((role) => {
                        const Icon = role.icon
                        return (
                            <Card
                                key={role.id}
                                className="group cursor-pointer border-2 transition-all duration-200 hover:border-primary hover:shadow-lg"
                                onClick={() => navigate(role.path)}
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">{role.badge}</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{role.label}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">{role.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-1.5 mb-6">
                                        {role.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate(role.path) }}>
                                        Sign in as {role.label.split(' ')[0]}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <p className="mt-10 text-xs text-muted-foreground text-center max-w-sm">
                    Access is restricted to verified administrators. New registrations require Super Admin approval.
                </p>
            </div>
        </div>
    )
}
