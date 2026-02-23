import { useState } from 'react'
import { mockVolunteers, mockJoinRequests, type Volunteer, type JoinRequest, type Status } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, ShieldOff, ChevronRight, ExternalLink, Info, UserCheck, UserX } from 'lucide-react'
import { VolunteerProfileDialog, canDeregister } from '@/components/shared/VolunteerProfileDialog'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function NgoVolunteers() {
    const [search, setSearch] = useState('')
    const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers.filter(v => v.ngo_certified))
    const [applications, setApplications] = useState<JoinRequest[]>(mockJoinRequests)
    const [selected, setSelected] = useState<Volunteer | null>(null)

    const filteredVols = volunteers.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleDeregister = (id: string) => setVolunteers(prev => prev.filter(v => v.id !== id))

    const updateStatus = (id: string, status: Status) => {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    }

    const pendingCount = applications.filter(a => a.status === 'pending').length

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Volunteer Management</h2>
                <p className="text-muted-foreground">
                    Click any member to view their full profile, ratings, and caller feedback
                </p>
            </div>

            <Tabs defaultValue="members">
                <TabsList>
                    <TabsTrigger value="members">NGO Members ({volunteers.length})</TabsTrigger>
                    <TabsTrigger value="applications" className="relative">
                        Applications
                        {pendingCount > 0 && (
                            <Badge variant="warning" className="ml-1.5 h-5 min-w-[20px] rounded-full px-1.5 text-[10px]">
                                {pendingCount}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* ── Tab 1: NGO Members ────────────────────────────────────── */}
                <TabsContent value="members" className="mt-6 space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <CardTitle className="text-base">Certified NGO Members</CardTitle>
                                    <CardDescription>
                                        Deregistration enabled when rating &lt; 3 AND total calls ≥ 50
                                    </CardDescription>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Volunteer</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Total Calls</TableHead>
                                        <TableHead>Skills</TableHead>
                                        <TableHead>Badges</TableHead>
                                        <TableHead>Risk</TableHead>
                                        <TableHead />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVols.map(v => {
                                        const atRisk = canDeregister(v)
                                        return (
                                            <TableRow key={v.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelected(v)}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                                                            {v.full_name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{v.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{v.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Star className={`h-3.5 w-3.5 ${v.rating_avg < 3 ? 'text-destructive' : 'text-amber-500 fill-amber-500'}`} />
                                                        <span className={`font-semibold ${v.rating_avg < 3 ? 'text-destructive' : ''}`}>{v.rating_avg}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={atRisk ? 'font-semibold text-destructive' : ''}>{v.total_calls}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {v.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {v.govt_certified && <Badge variant="default" className="text-xs">Gov</Badge>}
                                                        <Badge variant="secondary" className="text-xs">NGO</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {atRisk
                                                        ? <Badge variant="destructive" className="text-xs gap-1"><ShieldOff className="h-3 w-3" /> Eligible</Badge>
                                                        : <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>}
                                                </TableCell>
                                                <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/40 border-dashed">
                        <CardContent className="py-3 flex items-center gap-2">
                            <ShieldOff className="h-4 w-4 text-muted-foreground shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                <strong>Deregistration Rule:</strong>{' '}
                                <code className="font-mono">rating_avg &lt; 3</code> AND <code className="font-mono">total_calls ≥ 50</code>
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Tab 2: Applications (manually manageable) ─────────────── */}
                <TabsContent value="applications" className="mt-6 space-y-4">
                    {/* Info banner */}
                    <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
                        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">How volunteering works</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                                Volunteers apply through the{' '}
                                <a href="https://aidly.in/ngo" target="_blank" rel="noopener noreferrer"
                                    className="text-primary underline-offset-2 hover:underline inline-flex items-center gap-0.5">
                                    NGO website <ExternalLink className="h-3 w-3" />
                                </a>.
                                You can update each application's Aidly platform status here — this controls whether the volunteer can be listed as an NGO member.
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Volunteer Applications</CardTitle>
                            <CardDescription>
                                {applications.filter(a => a.status === 'approved').length} approved ·{' '}
                                {applications.filter(a => a.status === 'pending').length} pending ·{' '}
                                {applications.filter(a => a.status === 'rejected').length} rejected
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Skills</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Calls</TableHead>
                                        <TableHead>Applied</TableHead>
                                        <TableHead>Status on Aidly</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map(a => (
                                        <TableRow key={a.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{a.volunteer_name}</p>
                                                    <p className="text-xs text-muted-foreground">{a.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {a.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="font-semibold">{a.rating_avg}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{a.total_calls}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{a.requested_at}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'destructive' : 'warning'}
                                                    className="text-xs capitalize"
                                                >
                                                    {a.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {a.status === 'pending' && (
                                                    <div className="flex gap-2 justify-end">
                                                        {/* Reject */}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                                                    <UserX className="h-3.5 w-3.5 mr-1" />Reject
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Mark <strong>{a.volunteer_name}</strong>'s application as rejected on the Aidly platform.
                                                                        They will not be listed as an NGO member.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => updateStatus(a.id, 'rejected')}>
                                                                        Reject
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        {/* Approve */}
                                                        <Button size="sm" onClick={() => updateStatus(a.id, 'approved')}>
                                                            <UserCheck className="h-3.5 w-3.5 mr-1" />Approve
                                                        </Button>
                                                    </div>
                                                )}
                                                {a.status === 'approved' && (
                                                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => updateStatus(a.id, 'rejected')}>
                                                        <UserX className="h-3.5 w-3.5 mr-1" />Revoke
                                                    </Button>
                                                )}
                                                {a.status === 'rejected' && (
                                                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => updateStatus(a.id, 'approved')}>
                                                        <UserCheck className="h-3.5 w-3.5 mr-1" />Re-approve
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <VolunteerProfileDialog
                volunteer={selected}
                open={!!selected}
                onClose={() => setSelected(null)}
                onDeregister={handleDeregister}
                adminRole="ngo"
            />
        </div>
    )
}
