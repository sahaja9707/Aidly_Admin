import { useState } from 'react'
import { mockVolunteers, mockJoinRequests, type Volunteer, type JoinRequest } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Search, UserCheck, UserX, ShieldOff, Star } from 'lucide-react'

export default function NgoVolunteers() {
    const [search, setSearch] = useState('')
    const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers.filter(v => v.ngo_certified))
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(mockJoinRequests)

    const filteredVols = volunteers.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase())
    )

    const canRevokeNgoTag = (v: Volunteer) => v.rating_avg < 3 && v.total_calls > 30

    const handleRevoke = (id: string) => {
        setVolunteers(prev => prev.filter(v => v.id !== id))
    }

    const handleRequest = (id: string, action: 'approved' | 'rejected') => {
        setJoinRequests(prev => prev.map(j => j.id === id ? { ...j, status: action } : j))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Volunteer Management</h2>
                <p className="text-muted-foreground">Manage NGO volunteers and process join requests</p>
            </div>

            <Tabs defaultValue="volunteers">
                <TabsList>
                    <TabsTrigger value="volunteers">NGO Volunteers ({filteredVols.length})</TabsTrigger>
                    <TabsTrigger value="requests">
                        Join Requests ({joinRequests.filter(j => j.status === 'pending').length} pending)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="volunteers" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <CardTitle className="text-base">Certified NGO Members</CardTitle>
                                    <CardDescription>Governance rule: remove if rating &lt; 3 AND calls &gt; 30</CardDescription>
                                </div>
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search volunteers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVols.map(v => (
                                        <TableRow key={v.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{v.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">{v.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className={`h-3.5 w-3.5 ${v.rating_avg < 3 ? 'text-destructive' : 'text-amber-500 fill-amber-500'}`} />
                                                    <span className={`font-semibold ${v.rating_avg < 3 ? 'text-destructive' : ''}`}>{v.rating_avg}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={v.total_calls > 30 && v.rating_avg < 3 ? 'font-bold text-destructive' : ''}>{v.total_calls}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {v.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {v.govt_certified && <Badge variant="default" className="text-xs">Gov</Badge>}
                                                    {v.ngo_certified && <Badge variant="secondary" className="text-xs">NGO</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" disabled={!canRevokeNgoTag(v)}
                                                            className={canRevokeNgoTag(v) ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' : ''}>
                                                            <ShieldOff className="h-3.5 w-3.5 mr-1" />Remove
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Remove NGO Volunteer?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Remove <strong>{v.full_name}</strong> from your NGO (rating: {v.rating_avg}, calls: {v.total_calls}).
                                                                Rule: <em>rating &lt; 3 AND total_calls &gt; 30</em>.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleRevoke(v.id)}>
                                                                Remove from NGO
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Join Requests</CardTitle>
                            <CardDescription>Volunteers requesting to join your NGO</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Volunteer</TableHead>
                                        <TableHead>Skills</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Calls</TableHead>
                                        <TableHead>Requested</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {joinRequests.map(j => (
                                        <TableRow key={j.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{j.volunteer_name}</p>
                                                    <p className="text-xs text-muted-foreground">{j.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {j.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="font-semibold">{j.rating_avg}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{j.total_calls}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{j.requested_at}</TableCell>
                                            <TableCell>
                                                <Badge variant={j.status === 'approved' ? 'success' : j.status === 'rejected' ? 'destructive' : 'warning'} className="text-xs capitalize">
                                                    {j.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {j.status === 'pending' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="outline" size="sm" onClick={() => handleRequest(j.id, 'rejected')}>
                                                            <UserX className="h-3.5 w-3.5 mr-1" />Reject
                                                        </Button>
                                                        <Button size="sm" onClick={() => handleRequest(j.id, 'approved')}>
                                                            <UserCheck className="h-3.5 w-3.5 mr-1" />Approve
                                                        </Button>
                                                    </div>
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
        </div>
    )
}
