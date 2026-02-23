import { useState } from 'react'
import { mockAdminUsers, type AdminUser } from '@/data/mockData'
import { mockVolunteers, type Volunteer } from '@/data/mockData'
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
import { Search, Ban, UserCheck, ShieldOff, Star } from 'lucide-react'

export default function SuperModeration() {
    const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
    const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers)
    const [search, setSearch] = useState('')

    const canBanVolunteer = (v: Volunteer) => v.rating_avg < 2 && v.total_calls > 50

    const toggleSuspend = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, is_suspended: !u.is_suspended } : u))
    const banVolunteer = (id: string) => setVolunteers(prev => prev.filter(v => v.id !== id))

    const filteredVols = volunteers.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">User Moderation</h2>
                <p className="text-muted-foreground">Suspend admins and remove low-rated users from the platform</p>
            </div>

            <Tabs defaultValue="admins">
                <TabsList>
                    <TabsTrigger value="admins">Admin Users ({users.length})</TabsTrigger>
                    <TabsTrigger value="volunteers">Volunteer Moderation ({volunteers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="admins" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Admin Users</CardTitle>
                            <CardDescription>Suspend or disable Government / NGO admin accounts</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Admin</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Organisation</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{u.full_name}</p>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={u.role === 'govt' ? 'default' : 'secondary'} className="text-xs">
                                                    {u.role === 'govt' ? 'Gov Admin' : 'NGO Admin'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{u.org_name}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{u.created_at}</TableCell>
                                            <TableCell>
                                                <Badge variant={u.is_suspended ? 'destructive' : 'success'} className="text-xs">
                                                    {u.is_suspended ? 'Suspended' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant={u.is_suspended ? 'outline' : 'destructive'} size="sm">
                                                            {u.is_suspended ? <><UserCheck className="h-3.5 w-3.5 mr-1" />Reinstate</> : <><ShieldOff className="h-3.5 w-3.5 mr-1" />Suspend</>}
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>{u.is_suspended ? 'Reinstate' : 'Suspend'} {u.full_name}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {u.is_suspended
                                                                    ? `This will restore access for ${u.full_name}.`
                                                                    : `This will block ${u.full_name}'s access to their ${u.role === 'govt' ? 'Government' : 'NGO'} admin panel.`}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => toggleSuspend(u.id)}>Confirm</AlertDialogAction>
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

                <TabsContent value="volunteers" className="mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <CardTitle className="text-base">Volunteer Banlist</CardTitle>
                                    <CardDescription>Ban rule: <code>rating &lt; 2 AND total_calls &gt; 50</code></CardDescription>
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
                                        <TableHead>Eligible to Ban</TableHead>
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
                                                    <Star className={`h-3.5 w-3.5 ${v.rating_avg < 2 ? 'text-destructive' : 'text-amber-500 fill-amber-500'}`} />
                                                    <span className={`font-semibold ${v.rating_avg < 2 ? 'text-destructive' : ''}`}>{v.rating_avg}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={v.total_calls > 50 ? 'font-semibold text-destructive' : ''}>{v.total_calls}</TableCell>
                                            <TableCell>
                                                <Badge variant={canBanVolunteer(v) ? 'destructive' : 'outline'} className="text-xs">
                                                    {canBanVolunteer(v) ? 'Eligible' : 'Not Eligible'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" disabled={!canBanVolunteer(v)}
                                                            className={canBanVolunteer(v) ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' : ''}>
                                                            <Ban className="h-3.5 w-3.5 mr-1" />Ban User
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Ban {v.full_name}?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Permanently remove <strong>{v.full_name}</strong> from the Aidly platform. Rule triggered: rating {v.rating_avg} &lt; 2 AND calls {v.total_calls} &gt; 50.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => banVolunteer(v.id)}>
                                                                Permanently Ban
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
            </Tabs>
        </div>
    )
}
