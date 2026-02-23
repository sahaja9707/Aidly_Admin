import { useState } from 'react'
import { mockAlerts, type Alert, type AlertType, type TargetScope } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, ExternalLink, Bell, BellOff } from 'lucide-react'

const alertTypeColors: Record<AlertType, 'destructive' | 'warning' | 'secondary'> = {
    disaster: 'destructive',
    health: 'warning',
    notice: 'secondary',
}

export default function GovAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        title: '', description: '', alert_type: 'disaster' as AlertType,
        target_scope: 'all' as TargetScope, official_url: '',
    })

    const handleCreate = () => {
        const newAlert: Alert = {
            id: `a${Date.now()}`, ...form, issued_by: 'Gov Admin',
            is_active: true, created_at: new Date().toISOString().split('T')[0],
            expires_at: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        }
        setAlerts(prev => [newAlert, ...prev])
        setOpen(false)
        setForm({ title: '', description: '', alert_type: 'disaster', target_scope: 'all', official_url: '' })
    }

    const toggleActive = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: !a.is_active } : a))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Alert Broadcasting</h2>
                    <p className="text-muted-foreground">Create and manage official government notifications</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Create Alert</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[540px]">
                        <DialogHeader>
                            <DialogTitle>Create Official Alert</DialogTitle>
                            <DialogDescription>Broadcast an official notification to Aidly users via FCM push.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="alert-title">Alert Title</Label>
                                <Input id="alert-title" placeholder="e.g. Cyclone Warning — Coastal Odisha" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="alert-desc">Description</Label>
                                <Textarea id="alert-desc" placeholder="Detailed description of the alert..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Alert Type</Label>
                                    <Select value={form.alert_type} onValueChange={v => setForm(f => ({ ...f, alert_type: v as AlertType }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="disaster">🚨 Disaster Alert</SelectItem>
                                            <SelectItem value="health">🏥 Health Advisory</SelectItem>
                                            <SelectItem value="notice">📢 Public Notice</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Select value={form.target_scope} onValueChange={v => setForm(f => ({ ...f, target_scope: v as TargetScope }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            <SelectItem value="volunteers">Volunteers Only</SelectItem>
                                            <SelectItem value="govt_volunteers">Govt Volunteers Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="official-url">Official Government URL</Label>
                                <Input id="official-url" placeholder="https://ndma.gov.in/..." value={form.official_url} onChange={e => setForm(f => ({ ...f, official_url: e.target.value }))} />
                                <p className="text-xs text-muted-foreground">Users clicking disaster alerts will be redirected to this URL.</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={!form.title || !form.description}>Broadcast Alert</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">All Alerts</CardTitle>
                    <CardDescription>{alerts.filter(a => a.is_active).length} active, {alerts.filter(a => !a.is_active).length} inactive</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Official URL</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alerts.map(alert => (
                                <TableRow key={alert.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{alert.title}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{alert.description}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={alertTypeColors[alert.alert_type]} className="text-xs capitalize">{alert.alert_type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground capitalize">{alert.target_scope.replace('_', ' ')}</TableCell>
                                    <TableCell>
                                        {alert.official_url ? (
                                            <a href={alert.official_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                                View <ExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : <span className="text-xs text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{alert.created_at}</TableCell>
                                    <TableCell>
                                        <Badge variant={alert.is_active ? 'success' : 'outline'} className="text-xs">
                                            {alert.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => toggleActive(alert.id)}>
                                            {alert.is_active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
