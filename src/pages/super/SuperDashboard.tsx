import { useEffect, useState } from 'react'
import { mockVolunteers, mockNGOs, mockAlerts, mockRegistrations, mockAdminUsers } from '@/data/mockData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Building2, Shield, Bell, Activity, TrendingUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { getAllUsers, suspendUser, unsuspendUser } from '@/lib/supabase'

export default function SuperDashboard() {
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        const loadUsers = async () => {
            const { data, error } = await getAllUsers()

            if (error) {
                console.error(error)
                return
            }

            setUsers(data || [])
        }

        loadUsers()
    }, [])

    const handleSuspend = async (id: string) => {
        const { error } = await suspendUser(id)

        if (!error) {
            setUsers(prev =>
                prev.map(user =>
                    user.id === id
                        ? { ...user, is_suspended: true }
                        : user
                )
            )
        }
    }

    const handleUnsuspend = async (id: string) => {
        const { error } = await unsuspendUser(id)

        if (!error) {
            setUsers(prev =>
                prev.map(user =>
                    user.id === id
                        ? { ...user, is_suspended: false }
                        : user
                )
            )
        }
    }

    const totalUsers = mockVolunteers.length + mockAdminUsers.length
    const totalNGOs = mockNGOs.length
    const totalGovt = mockAdminUsers.filter(u => u.role === 'govt').length
    const activeAlerts = mockAlerts.filter(a => a.is_active).length
    const pendingReg = mockRegistrations.filter(r => r.status === 'pending').length

    const kpis = [
        { label: 'Total Users', value: totalUsers, icon: Users, sub: 'Volunteers + admins' },
        { label: 'Total NGOs', value: totalNGOs, icon: Building2, sub: `${mockNGOs.filter(n => n.verified_badge).length} verified` },
        { label: 'Govt Admins', value: totalGovt, icon: Shield, sub: 'Active government panels' },
        { label: 'Active Alerts', value: activeAlerts, icon: Bell, sub: 'Currently broadcasting' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Platform Overview</h2>
                    <p className="text-muted-foreground">Aidly ecosystem governance summary</p>
                </div>
                {pendingReg > 0 && (
                    <Badge variant="warning" className="gap-1">
                        <Activity className="h-3 w-3" />
                        {pendingReg} pending registrations
                    </Badge>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map(kpi => {
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
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> NGO Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NGO</TableHead>
                                    <TableHead>Tier</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockNGOs.map(n => (
                                    <TableRow key={n.id}>
                                        <TableCell className="font-medium">{n.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs capitalize">{n.subscription_tier}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={n.verified_badge ? 'success' : 'warning'} className="text-xs">
                                                {n.verified_badge ? 'Verified' : 'Unverified'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={n.is_disabled ? 'destructive' : 'success'} className="text-xs">
                                                {n.is_disabled ? 'Disabled' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Active Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockAlerts.filter(a => a.is_active).map(alert => (
                            <div key={alert.id} className="flex items-start gap-3 rounded-lg border p-3">
                                <Badge variant={alert.alert_type === 'disaster' ? 'destructive' : alert.alert_type === 'health' ? 'warning' : 'secondary'} className="text-xs shrink-0 mt-0.5">
                                    {alert.alert_type}
                                </Badge>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground">{alert.target_scope}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
