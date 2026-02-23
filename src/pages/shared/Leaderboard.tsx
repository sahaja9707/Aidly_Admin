import { useState } from 'react'
import { mockVolunteers, type Volunteer } from '@/data/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, Trophy, Search } from 'lucide-react'

const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

interface LeaderboardProps {
    filterMode?: 'govt' | 'ngo' | 'all'
}

export default function Leaderboard({ filterMode = 'all' }: LeaderboardProps) {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'rating_avg' | 'total_calls'>('rating_avg')

    const base: Volunteer[] = filterMode === 'govt'
        ? mockVolunteers.filter(v => v.govt_certified)
        : filterMode === 'ngo'
            ? mockVolunteers.filter(v => v.ngo_certified)
            : mockVolunteers

    const sorted = [...base].sort((a, b) => b[sortBy] - a[sortBy])

    const filtered = sorted.filter(v =>
        v.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (v.ngo_name ?? '').toLowerCase().includes(search.toLowerCase())
    )

    const topThree = sorted.slice(0, 3)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Volunteer Leaderboard</h2>
                <p className="text-muted-foreground">
                    {filterMode === 'govt' ? 'Government-certified' : filterMode === 'ngo' ? 'NGO-affiliated' : 'All'} volunteers ranked by performance
                </p>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-3 gap-4">
                {topThree.map((v, i) => (
                    <Card key={v.id} className={`text-center ${i === 0 ? 'border-amber-300 bg-amber-50/50' : i === 1 ? 'border-slate-300 bg-slate-50/50' : 'border-orange-200 bg-orange-50/30'}`}>
                        <CardContent className="pt-6 pb-4">
                            <div className="text-3xl mb-2">{medals[i + 1]}</div>
                            <div className="h-12 w-12 rounded-full bg-muted mx-auto flex items-center justify-center text-sm font-semibold mb-2">
                                {v.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p className="font-semibold text-sm">{v.full_name}</p>
                            <p className="text-xs text-muted-foreground mb-2">{v.ngo_name}</p>
                            <div className="flex items-center justify-center gap-1">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="font-bold text-sm">{v.rating_avg}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{v.total_calls} calls</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Full Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Trophy className="h-4 w-4" /> Full Rankings
                            </CardTitle>
                            <CardDescription>{filtered.length} volunteers</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-48">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'rating_avg' | 'total_calls')}>
                                <SelectTrigger className="w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rating_avg">By Rating</SelectItem>
                                    <SelectItem value="total_calls">By Calls</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Rank</TableHead>
                                <TableHead>Volunteer</TableHead>
                                <TableHead>NGO</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Total Calls</TableHead>
                                <TableHead>Crisis Tags</TableHead>
                                <TableHead>Badges</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((v, i) => {
                                const rank = sorted.findIndex(s => s.id === v.id) + 1
                                return (
                                    <TableRow key={v.id} className={rank <= 3 ? 'bg-muted/20' : ''}>
                                        <TableCell className="font-bold text-center">
                                            {medals[rank] ?? rank}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{v.full_name}</p>
                                                <p className="text-xs text-muted-foreground">{v.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{v.ngo_name ?? '—'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                <span className="font-semibold">{v.rating_avg}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{v.total_calls}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {v.crisis_tags.map(t => (
                                                    <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {v.govt_certified && <Badge variant="default" className="text-xs">Gov</Badge>}
                                                {v.ngo_certified && <Badge variant="secondary" className="text-xs">NGO</Badge>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
