import { mockAuditLogs } from '@/data/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList } from 'lucide-react'

const actionColors: Record<string, 'default' | 'secondary' | 'destructive' | 'warning' | 'success' | 'outline'> = {
    approve_registration: 'success',
    reject_registration: 'destructive',
    revoke_gov_tag: 'warning',
    revoke_ngo_tag: 'warning',
    suspend_user: 'destructive',
    add_ngo: 'success',
    disable_ngo: 'destructive',
    approve_volunteer: 'success',
    create_alert: 'default',
}

export default function SuperAuditLog() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Audit Log</h2>
                <p className="text-muted-foreground">Full governance action history across the Aidly platform</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" /> Action History
                    </CardTitle>
                    <CardDescription>{mockAuditLogs.length} recorded governance actions</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Metadata</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockAuditLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{log.created_at}</TableCell>
                                    <TableCell className="font-medium text-sm">{log.admin_name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={actionColors[log.action_type] ?? 'outline'}
                                            className="text-xs"
                                        >
                                            {log.action_type.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{log.target}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{log.metadata}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
