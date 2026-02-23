import { mockVolunteers, mockJoinRequests } from '@/data/mockData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, Megaphone, Star, CheckCircle } from 'lucide-react'

const campaigns = [
    { name: 'Flood Relief 2026', status: 'Active', volunteers: 12 },
    { name: 'Kerala Drought Aid', status: 'Active', volunteers: 8 },
    { name: 'Cyclone Remal Response', status: 'Completed', volunteers: 24 },
]

export default function NgoDashboard() {
    const ngoVolunteers = mockVolunteers.filter(v => v.ngo_certified)
    const pendingRequests = mockJoinRequests.filter(j => j.status === 'pending').length
    const avgRating = (ngoVolunteers.reduce((s, v) => s + v.rating_avg, 0) / ngoVolunteers.length).toFixed(2)

    const kpis = [
        { label: 'NGO Volunteers', value: ngoVolunteers.length, icon: Users, sub: 'Certified by your NGO' },
        { label: 'Pending Requests', value: pendingRequests, icon: Clock, sub: 'Awaiting approval' },
        { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'Active').length, icon: Megaphone, sub: 'Display only' },
        { label: 'Avg Volunteer Rating', value: avgRating, icon: Star, sub: 'Across NGO volunteers' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">HelpIndia NGO governance summary</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon
                    return (
                        <Card key={kpi.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{kpi.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Active Campaigns</CardTitle>
                        <CardDescription>Display only — donations handled externally</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {campaigns.map(c => (
                            <div key={c.name} className="flex items-center justify-between rounded-lg border p-3">
                                <div>
                                    <p className="text-sm font-medium">{c.name}</p>
                                    <p className="text-xs text-muted-foreground">{c.volunteers} volunteers</p>
                                </div>
                                <Badge variant={c.status === 'Active' ? 'success' : 'outline'} className="text-xs shrink-0">{c.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top NGO Volunteers</CardTitle>
                        <CardDescription>Highest rated members</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {ngoVolunteers.sort((a, b) => b.rating_avg - a.rating_avg).slice(0, 4).map(v => (
                            <div key={v.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                        {v.full_name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{v.full_name}</p>
                                        {v.govt_certified && <Badge variant="default" className="text-xs py-0">Gov Certified</Badge>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-semibold">{v.rating_avg}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
