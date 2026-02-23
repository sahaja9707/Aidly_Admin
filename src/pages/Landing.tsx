import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Building2, Star, ArrowRight, Phone, Globe, Users } from 'lucide-react'

const stats = [
    { label: 'Verified NGOs', value: '120+' },
    { label: 'Govt Bodies', value: '32' },
    { label: 'Certified Volunteers', value: '14K+' },
    { label: 'Disasters Responded', value: '200+' },
]

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                            <span className="text-sm font-bold text-primary-foreground">A</span>
                        </div>
                        <div>
                            <p className="font-semibold text-sm leading-none">Aidly</p>
                            <p className="text-xs text-muted-foreground">Admin Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/roles')}>All Roles</Button>
                        <Button size="sm" onClick={() => navigate('/ngo-admin-hub')}>NGO Admin</Button>
                        <Button size="sm" variant="outline" onClick={() => navigate('/gov-admin-hub')}>Gov Admin</Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs">
                    Trusted Governance Infrastructure — India
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight max-w-3xl leading-tight mb-6">
                    Governance Hub for{' '}
                    <span className="underline decoration-primary underline-offset-4">Disaster Response</span>
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground leading-relaxed mb-10">
                    Aidly Admin Portal connects NGOs, Government bodies, and certified volunteers.
                    A unified platform for coordination, certification, and emergency response.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" className="gap-2 h-12 px-8" onClick={() => navigate('/ngo-admin-hub')}>
                        <Building2 className="h-5 w-5" /> NGO Admin Portal
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 h-12 px-8" onClick={() => navigate('/gov-admin-hub')}>
                        <Shield className="h-5 w-5" /> Government Admin Portal
                    </Button>
                    <Button size="lg" variant="ghost" className="gap-2 h-12 px-8" onClick={() => navigate('/login/super')}>
                        <Star className="h-5 w-5" /> Super Admin
                    </Button>
                </div>
            </section>

            {/* Stats */}
            <section className="border-t border-b bg-muted/30">
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map(s => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-bold">{s.value}</p>
                            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Cards */}
            <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6 w-full">
                {[
                    { icon: Building2, title: 'NGO Admins', desc: 'Manage volunteers, view application status, and oversee your organisation profile.', cta: 'NGO Portal', path: '/ngo-admin-hub' },
                    { icon: Shield, title: 'Government Admins', desc: 'Certify volunteers, broadcast disaster alerts, and post official announcements.', cta: 'Gov Portal', path: '/gov-admin-hub' },
                    { icon: Users, title: 'Super Admins', desc: 'Full platform control — approve registrations, manage NGOs, and moderate users.', cta: 'Super Portal', path: '/login/super' },
                ].map(card => {
                    const Icon = card.icon
                    return (
                        <Card key={card.title} className="group cursor-pointer border-2 hover:border-primary transition-all hover:shadow-md" onClick={() => navigate(card.path)}>
                            <CardContent className="pt-6 pb-5 space-y-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">{card.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{card.desc}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-1 -ml-2 group-hover:gap-2 transition-all">
                                    {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </section>

            {/* Footer */}
            <footer className="border-t py-6 text-center text-xs text-muted-foreground">
                <div className="flex justify-center items-center gap-4">
                    <span>© 2026 Aidly</span>
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Made in India</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> admin@aidly.in</span>
                </div>
            </footer>
        </div>
    )
}
