import { useState } from 'react'
import { mockVolunteers, type Volunteer } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Search, ShieldOff, Star } from 'lucide-react'

export default function GovVolunteers() {
    const [search, setSearch] = useState('')
    const [volunteers, setVolunteers] = useState(mockVolunteers.filter(v => v.govt_certified))

    const filtered = volunteers.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
    )

    const canRevokeGovTag = (v: Volunteer) => v.rating_avg < 3 && v.total_calls > 10

    const handleRevoke = (id: string) => {
        setVolunteers(prev => prev.map(v => v.id === id ? { ...v, govt_certified: false } : v).filter(v => v.govt_certified))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Government Volunteers</h2>
                <p className="text-muted-foreground">Manage government-certified volunteers and enforce accountability rules</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <CardTitle className="text-base">Certified Volunteers</CardTitle>
                            <CardDescription>{filtered.length} govt-certified volunteers</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search volunteers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
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
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((v) => (
                                <TableRow key={v.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{v.full_name}</p>
                                            <p className="text-xs text-muted-foreground">{v.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                            <span className={`font-semibold ${v.rating_avg < 3 ? 'text-destructive' : ''}`}>{v.rating_avg}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={v.total_calls > 10 && v.rating_avg < 3 ? 'text-destructive font-semibold' : ''}>{v.total_calls}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {v.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {v.govt_certified && <Badge variant="default" className="text-xs">Gov Certified</Badge>}
                                            {v.ngo_certified && <Badge variant="secondary" className="text-xs">NGO</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={v.available_now ? 'success' : 'outline'} className="text-xs">
                                            {v.available_now ? 'Available' : 'Offline'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={!canRevokeGovTag(v)}
                                                    className={canRevokeGovTag(v) ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' : ''}
                                                >
                                                    <ShieldOff className="h-3.5 w-3.5 mr-1" />
                                                    Revoke Tag
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Revoke Government Certification?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will remove the <strong>Gov Certified</strong> badge from{' '}
                                                        <strong>{v.full_name}</strong> (rating: {v.rating_avg}, calls: {v.total_calls}).
                                                        This action triggers the governance rule: <em>rating &lt; 3 AND calls &gt; 10</em>.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive hover:bg-destructive/90"
                                                        onClick={() => handleRevoke(v.id)}
                                                    >
                                                        Revoke Certification
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

            {/* Rule notice */}
            <Card className="bg-muted/40 border-dashed">
                <CardContent className="py-3 flex items-center gap-2">
                    <ShieldOff className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <strong>Governance Rule:</strong> Revoke Gov Tag is enabled when volunteer's{' '}
                        <code className="font-mono">rating_avg &lt; 3 AND total_calls &gt; 10</code>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
