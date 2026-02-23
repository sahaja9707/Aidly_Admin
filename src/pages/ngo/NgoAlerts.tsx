import { useEffect, useState } from 'react'
import { getAllAlerts, createAlert, toggleAlert, type Alert, type AlertType } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, ExternalLink, Bell, BellOff, Loader2, AlertCircle } from 'lucide-react'

const alertTypeColors: Record<AlertType, 'destructive' | 'warning' | 'secondary'> = {
    disaster: 'destructive',
    health: 'warning',
    notice: 'secondary',
}

const emptyForm = { title: '', description: '', alert_type: 'notice' as AlertType, official_url: '' }

export default function NgoAlerts() {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [submitting, setSubmitting] = useState(false)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const fetchAlerts = async () => {
        setLoading(true)
        setError('')
        const { data, error: err } = await getAllAlerts()
        if (err) setError(err.message)
        else setAlerts(data ?? [])
        setLoading(false)
    }

    useEffect(() => { fetchAlerts() }, [])

    const handleCreate = async () => {
        if (!form.title || !form.description) return
        setSubmitting(true)
        const expires = new Date(Date.now() + 7 * 86400000).toISOString()
        const { data, error: err } = await createAlert({
            title: form.title,
            description: form.description,
            alert_type: form.alert_type,
            official_url: form.official_url || undefined,
            issued_by: user?.id,
            is_active: true,
            expires_at: expires,
        })
        if (err) setError(err.message)
        else { setOpen(false); setForm(emptyForm); await fetchAlerts() }
        setSubmitting(false)
    }

    const handleToggle = async (id: string, current: boolean) => {
        setTogglingId(id)
        const { error: err } = await toggleAlert(id, !current)
        if (!err) setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a))
        else setError(err.message)
        setTogglingId(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Alerts</h2>
                    <p className="text-muted-foreground">View and broadcast NGO community alerts</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Create Alert</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[540px]">
                        <DialogHeader>
                            <DialogTitle>Create NGO Alert</DialogTitle>
                            <DialogDescription>Broadcast a community notification to Aidly users.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="ngo-alert-title">Alert Title</Label>
                                <Input id="ngo-alert-title" placeholder="e.g. Volunteer Drive — Flood Relief" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ngo-alert-desc">Description</Label>
                                <Textarea id="ngo-alert-desc" placeholder="Detailed description..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
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
                                <Label htmlFor="ngo-official-url">Reference URL (optional)</Label>
                                <Input id="ngo-official-url" placeholder="https://..." value={form.official_url} onChange={e => setForm(f => ({ ...f, official_url: e.target.value }))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => { setOpen(false); setForm(emptyForm) }}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={submitting || !form.title || !form.description}>
                                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Broadcast Alert
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">All Alerts</CardTitle>
                    <CardDescription>
                        {loading ? 'Loading...' : `${alerts.filter(a => a.is_active).length} active, ${alerts.filter(a => !a.is_active).length} inactive`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : alerts.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">No alerts yet. Create one above.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Reference URL</TableHead>
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
                                                <p className="text-xs text-muted-foreground truncate max-w-[220px]">{alert.description}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={alertTypeColors[alert.alert_type]} className="text-xs capitalize">{alert.alert_type}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {alert.official_url ? (
                                                <a href={alert.official_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                                                    View <ExternalLink className="h-3 w-3" />
                                                </a>
                                            ) : <span className="text-xs text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(alert.created_at).toLocaleDateString('en-IN')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={alert.is_active ? 'success' : 'outline'} className="text-xs">
                                                {alert.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" disabled={togglingId === alert.id} onClick={() => handleToggle(alert.id, alert.is_active)}>
                                                {togglingId === alert.id
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : alert.is_active ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
