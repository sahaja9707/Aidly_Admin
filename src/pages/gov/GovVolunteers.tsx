import { useState } from 'react'
import { mockVolunteers, type Volunteer } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Star, ShieldOff, ChevronRight } from 'lucide-react'
import { VolunteerProfileDialog, canDeregister } from '@/components/shared/VolunteerProfileDialog'

export default function GovVolunteers() {
    const [search, setSearch] = useState('')
    const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers.filter(v => v.govt_certified))
    const [selected, setSelected] = useState<Volunteer | null>(null)

    const filtered = volunteers.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleDeregister = (id: string) => {
        setVolunteers(prev => prev.filter(v => v.id !== id))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Government Volunteers</h2>
                <p className="text-muted-foreground">Click any volunteer to view their profile, ratings, and feedback</p>
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
                                onChange={e => setSearch(e.target.value)}
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
                                <TableHead>Deregister Risk</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((v) => {
                                const atRisk = canDeregister(v)
                                return (
                                    <TableRow
                                        key={v.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => setSelected(v)}
                                    >
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
                                                {v.ngo_certified && <Badge variant="secondary" className="text-xs">NGO</Badge>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={v.available_now ? 'success' : 'outline'} className="text-xs">
                                                {v.available_now ? 'Available' : 'Offline'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {atRisk ? (
                                                <Badge variant="destructive" className="text-xs gap-1">
                                                    <ShieldOff className="h-3 w-3" /> Eligible
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs text-muted-foreground">—</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Governance rule notice */}
            <Card className="bg-muted/40 border-dashed">
                <CardContent className="py-3 flex items-center gap-2">
                    <ShieldOff className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <strong>Deregistration Rule:</strong> Revoke Gov Certification is available when volunteer's{' '}
                        <code className="font-mono">rating_avg &lt; 3</code> AND <code className="font-mono">total_calls ≥ 50</code>
                    </p>
                </CardContent>
            </Card>

            <VolunteerProfileDialog
                volunteer={selected}
                open={!!selected}
                onClose={() => setSelected(null)}
                onDeregister={handleDeregister}
                adminRole="govt"
            />
        </div>
    )
}
