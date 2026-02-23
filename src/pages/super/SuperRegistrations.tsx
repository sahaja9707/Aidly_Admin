import { useState } from 'react'
import { mockRegistrations, mockNGOs, type AdminRegistration } from '@/data/mockData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { CheckCircle, XCircle } from 'lucide-react'

export default function SuperRegistrations() {
    const [registrations, setRegistrations] = useState<AdminRegistration[]>(mockRegistrations)

    const handle = (id: string, action: 'approved' | 'rejected') => {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
    }

    const pending = registrations.filter(r => r.status === 'pending')
    const processed = registrations.filter(r => r.status !== 'pending')

    const renderTable = (data: AdminRegistration[], showActions: boolean) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Requested Role</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>NGO Link</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(r => {
                    const linkedNGO = mockNGOs.find(n => n.id === r.ngo_id)
                    return (
                        <TableRow key={r.id}>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{r.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{r.email}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={r.requested_role === 'govt_admin' ? 'default' : 'secondary'} className="text-xs">
                                    {r.requested_role === 'govt_admin' ? 'Gov Admin' : 'NGO Admin'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{r.organization_name}</TableCell>
                            <TableCell>
                                {linkedNGO ? (
                                    <Badge variant={linkedNGO.verified_badge ? 'success' : 'warning'} className="text-xs">
                                        {linkedNGO.name}
                                    </Badge>
                                ) : <span className="text-xs text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{r.created_at}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'destructive' : 'warning'}
                                    className="text-xs capitalize"
                                >
                                    {r.status}
                                </Badge>
                            </TableCell>
                            {showActions && (
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                                    <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Reject Registration?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Reject <strong>{r.full_name}</strong>'s application for <strong>{r.organization_name}</strong>? They will be notified.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handle(r.id, 'rejected')}>Reject</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button size="sm" onClick={() => handle(r.id, 'approved')}>
                                            <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve
                                        </Button>
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Registration Approvals</h2>
                <p className="text-muted-foreground">Review and approve Government and NGO admin registrations</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        Pending Approvals
                        {pending.length > 0 && <Badge variant="warning">{pending.length}</Badge>}
                    </CardTitle>
                    <CardDescription>New admin registrations awaiting your review</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {pending.length > 0 ? renderTable(pending, true) : (
                        <div className="py-10 text-center text-muted-foreground text-sm">No pending registrations</div>
                    )}
                </CardContent>
            </Card>

            {processed.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Processed Registrations</CardTitle>
                        <CardDescription>Previously approved or rejected applications</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">{renderTable(processed, false)}</CardContent>
                </Card>
            )}
        </div>
    )
}
