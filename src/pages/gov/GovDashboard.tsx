import { mockVolunteers, mockAlerts } from '@/data/mockData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Star, Bell, AlertTriangle } from 'lucide-react'

export default function GovDashboard() {
    const govVolunteers = mockVolunteers.filter(v => v.govt_certified)
    const avgRating = (govVolunteers.reduce((s, v) => s + v.rating_avg, 0) / govVolunteers.length).toFixed(2)
    const activeAlerts = mockAlerts.filter(a => a.is_active).length

    const kpis = [
        { label: 'Govt Volunteers', value: govVolunteers.length, icon: Users, sub: 'Certified by government' },
        { label: 'Average Rating', value: avgRating, icon: Star, sub: 'Across all gov volunteers' },
        { label: 'Active Alerts', value: activeAlerts, icon: Bell, sub: 'Currently broadcasting' },
        { label: 'Disaster Mode', value: 'OFF', icon: AlertTriangle, sub: 'No active disaster declared' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Government admin governance summary</p>
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

            {/* Recent Alerts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Alerts</CardTitle>
                        <CardDescription>Active broadcast alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockAlerts.filter(a => a.is_active).slice(0, 3).map(alert => (
                            <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
                                <Badge variant={alert.alert_type === 'disaster' ? 'destructive' : alert.alert_type === 'health' ? 'warning' : 'secondary'} className="text-xs mt-0.5 shrink-0">
                                    {alert.alert_type}
                                </Badge>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground">Scope: {alert.target_scope}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Top Gov Volunteers</CardTitle>
                        <CardDescription>By rating average</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {govVolunteers.sort((a, b) => b.rating_avg - a.rating_avg).slice(0, 4).map(v => (
                            <div key={v.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                        {v.full_name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span className="text-sm font-medium">{v.full_name}</span>
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
