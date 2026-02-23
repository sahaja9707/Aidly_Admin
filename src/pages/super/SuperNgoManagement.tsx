import { useState } from 'react'
import { mockNGOs, type NGO, type SubscriptionTier } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, CheckCircle, ShieldOff, Building2 } from 'lucide-react'

export default function SuperNgoManagement() {
    const [ngos, setNgos] = useState<NGO[]>(mockNGOs)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        name: '', registration_number: '', contact_email: '', contact_phone: '',
        darpan_api_key: '', subscription_tier: 'nonprofit' as SubscriptionTier,
    })

    const handleAddNGO = () => {
        const newNGO: NGO = {
            id: `n${Date.now()}`,
            name: form.name,
            registration_number: form.registration_number,
            contact_email: form.contact_email,
            contact_phone: form.contact_phone,
            verified_badge: true,
            darpan_api_verified: form.darpan_api_key.length > 0,
            is_disabled: false,
            verified_by_admin: true,
            subscription_tier: form.subscription_tier,
            volunteer_count: 0,
            created_at: new Date().toISOString().split('T')[0],
        }
        setNgos(prev => [newNGO, ...prev])
        setOpen(false)
        setForm({ name: '', registration_number: '', contact_email: '', contact_phone: '', darpan_api_key: '', subscription_tier: 'nonprofit' })
    }

    const toggleDisable = (id: string) => {
        setNgos(prev => prev.map(n => n.id === id ? { ...n, is_disabled: !n.is_disabled } : n))
    }

    const toggleVerify = (id: string) => {
        setNgos(prev => prev.map(n => n.id === id ? { ...n, verified_badge: !n.verified_badge } : n))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">NGO Management</h2>
                <p className="text-muted-foreground">Add and manage NGOs in the Aidly ecosystem</p>
            </div>

            <Tabs defaultValue="registry">
                <TabsList>
                    <TabsTrigger value="registry">NGO Registry ({ngos.length})</TabsTrigger>
                    <TabsTrigger value="add">Add New NGO</TabsTrigger>
                </TabsList>

                <TabsContent value="registry" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">All NGOs</CardTitle>
                                    <CardDescription>
                                        {ngos.filter(n => n.verified_badge).length} verified · {ngos.filter(n => n.is_disabled).length} disabled
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NGO</TableHead>
                                        <TableHead>Registration No.</TableHead>
                                        <TableHead>Tier</TableHead>
                                        <TableHead>Darpan</TableHead>
                                        <TableHead>Verified</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ngos.map(n => (
                                        <TableRow key={n.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{n.name}</p>
                                                    <p className="text-xs text-muted-foreground">{n.contact_email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-mono">{n.registration_number}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs capitalize">{n.subscription_tier}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={n.darpan_api_verified ? 'success' : 'warning'} className="text-xs">
                                                    {n.darpan_api_verified ? 'Verified' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={n.verified_badge ? 'success' : 'outline'} className="text-xs">
                                                    {n.verified_badge ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={n.is_disabled ? 'destructive' : 'success'} className="text-xs">
                                                    {n.is_disabled ? 'Disabled' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" onClick={() => toggleVerify(n.id)}>
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                        {n.verified_badge ? 'Unverify' : 'Verify'}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant={n.is_disabled ? 'outline' : 'destructive'}>
                                                                <ShieldOff className="h-3.5 w-3.5 mr-1" />
                                                                {n.is_disabled ? 'Enable' : 'Disable'}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>{n.is_disabled ? 'Enable' : 'Disable'} {n.name}?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will {n.is_disabled ? 'restore access for' : 'block all access for'} <strong>{n.name}</strong> and its admins.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => toggleDisable(n.id)}>
                                                                    Confirm
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add" className="mt-6">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Add NGO (Offline Verified)
                            </CardTitle>
                            <CardDescription>
                                Add an NGO after completing offline verification. The NGO will be marked as verified immediately.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Organisation Name *</Label>
                                    <Input placeholder="e.g. Helping Hands India" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Registration Number *</Label>
                                    <Input placeholder="e.g. NGO-2024-XXX-001" value={form.registration_number} onChange={e => setForm(f => ({ ...f, registration_number: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Email *</Label>
                                    <Input type="email" placeholder="contact@ngo.org" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Phone</Label>
                                    <Input placeholder="+91-XXXXXXXXXX" value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Darpan NPO API Key</Label>
                                    <Input placeholder="Leave blank if not Darpan verified" value={form.darpan_api_key} onChange={e => setForm(f => ({ ...f, darpan_api_key: e.target.value }))} />
                                    <p className="text-xs text-muted-foreground">If provided, sets <code>darpan_api_verified = true</code></p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subscription Tier *</Label>
                                    <Select value={form.subscription_tier} onValueChange={v => setForm(f => ({ ...f, subscription_tier: v as SubscriptionTier }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nonprofit">Nonprofit ($1/month) — TURN infrastructure</SelectItem>
                                            <SelectItem value="profit">Profit (White-label lease)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                                <strong>Note:</strong> Adding an NGO here marks it as verified by Super Admin. The NGO admin will still need to register and be approved separately.
                            </div>
                            <Button
                                className="w-full gap-2"
                                onClick={handleAddNGO}
                                disabled={!form.name || !form.registration_number || !form.contact_email}
                            >
                                <Plus className="h-4 w-4" />
                                Add NGO to Environment
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
