import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle, Building2 } from 'lucide-react'

const disasterHistory = [
    { year: '2025', event: 'Kerala Floods', volunteers_deployed: 18, outcome: 'Successful' },
    { year: '2025', event: 'Tamil Nadu Cyclone', volunteers_deployed: 11, outcome: 'Successful' },
    { year: '2024', event: 'Bihar Drought Relief', volunteers_deployed: 7, outcome: 'Partial' },
]

const campaigns = [
    { name: 'Flood Relief 2026', volunteers: 12, status: 'Active' },
    { name: 'Kerala Drought Aid', volunteers: 8, status: 'Active' },
]

export default function NgoProfile() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">NGO Profile</h2>
                <p className="text-muted-foreground">Your organisation's public profile on Aidly</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                <Building2 className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">HelpIndia NGO</CardTitle>
                                <CardDescription>NGO-2019-HIN-001</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />Verified NGO
                            </Badge>
                            <Badge variant="secondary">Nonprofit Tier</Badge>
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">contact@helpindia.org</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone</span>
                                <span className="font-medium">+91-9800000001</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Darpan Verified</span>
                                <Badge variant="success" className="text-xs">Yes</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tier</span>
                                <span className="font-medium">Nonprofit ($1/mo)</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="text-sm">
                            <p className="font-medium mb-1">About</p>
                            <p className="text-muted-foreground leading-relaxed text-xs">
                                HelpIndia NGO has been supporting disaster relief operations across India since 2019, with a focus on flood response, medical aid, and community rehabilitation.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                    {/* Active Campaigns */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Active Campaigns</CardTitle>
                            <CardDescription>Display only — donation handling managed externally</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {campaigns.map(c => (
                                <div key={c.name} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <p className="text-sm font-medium">{c.name}</p>
                                        <p className="text-xs text-muted-foreground">{c.volunteers} volunteers deployed</p>
                                    </div>
                                    <Badge variant="success" className="text-xs">{c.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Disaster History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Disaster Participation History</CardTitle>
                            <CardDescription>Past disaster response operations</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Year</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Volunteers</TableHead>
                                        <TableHead>Outcome</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disasterHistory.map(d => (
                                        <TableRow key={d.event}>
                                            <TableCell className="font-medium">{d.year}</TableCell>
                                            <TableCell>{d.event}</TableCell>
                                            <TableCell>{d.volunteers_deployed}</TableCell>
                                            <TableCell>
                                                <Badge variant={d.outcome === 'Successful' ? 'success' : 'warning'} className="text-xs">{d.outcome}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
