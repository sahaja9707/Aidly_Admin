import { useState } from 'react'
import { mockAnnouncements, type Announcement } from '@/data/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Plus, Building } from 'lucide-react'

export default function GovProfile() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ title: '', content: '' })

    const handleAdd = () => {
        const next: Announcement = {
            id: `an${Date.now()}`, is_active: true,
            created_at: new Date().toISOString().split('T')[0],
            ...form,
        }
        setAnnouncements(prev => [next, ...prev])
        setOpen(false)
        setForm({ title: '', content: '' })
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Government Profile</h2>
                <p className="text-muted-foreground">Your official government organisation page on Aidly</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                                <Building className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Kerala SDMA</CardTitle>
                                <CardDescription>State Disaster Management Authority</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />Verified Organisation
                            </Badge>
                            <Badge variant="secondary">Government Body</Badge>
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">State</span>
                                <span className="font-medium">Kerala</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Contact</span>
                                <span className="font-medium">raj@kerala.gov.in</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Joined</span>
                                <span className="font-medium">Jan 2026</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="text-sm">
                            <p className="font-medium mb-1">About</p>
                            <p className="text-muted-foreground leading-relaxed">
                                The Kerala State Disaster Management Authority coordinates disaster response, volunteer certification, and emergency communications across Kerala.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Announcements */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Official Announcements</CardTitle>
                                <CardDescription>Public-facing announcements on your Aidly profile</CardDescription>
                            </div>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>New Announcement</DialogTitle>
                                        <DialogDescription>Post an official announcement to your profile.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input placeholder="Announcement title..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Textarea rows={4} placeholder="Announcement content..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                        <Button onClick={handleAdd} disabled={!form.title}>Publish</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.map(a => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.title}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">{a.content}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{a.created_at}</TableCell>
                                        <TableCell>
                                            <Badge variant={a.is_active ? 'success' : 'outline'} className="text-xs">
                                                {a.is_active ? 'Active' : 'Archived'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
