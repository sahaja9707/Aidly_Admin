import { mockFeedbacks, type Volunteer } from '@/data/mockData'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Star, Phone, Mail, ShieldOff, CheckCircle, Clock, Activity, AlertTriangle } from 'lucide-react'

interface VolunteerProfileDialogProps {
    volunteer: Volunteer | null
    open: boolean
    onClose: () => void
    onDeregister?: (id: string) => void
    /** 'govt' — revokes gov tag; 'ngo' — removes from ngo; 'super' — bans platform-wide */
    adminRole?: 'govt' | 'ngo' | 'super'
}

function StarRow({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`}
                />
            ))}
        </div>
    )
}

// Deregister rule: rating < 3 AND total_calls >= 50
export function canDeregister(v: Volunteer): boolean {
    return v.rating_avg < 3 && v.total_calls >= 50
}

export function VolunteerProfileDialog({
    volunteer,
    open,
    onClose,
    onDeregister,
    adminRole = 'govt',
}: VolunteerProfileDialogProps) {
    if (!volunteer) return null

    const feedbacks = mockFeedbacks.filter(f => f.volunteer_id === volunteer.id)
    const eligible = canDeregister(volunteer)

    const deregLabel =
        adminRole === 'govt' ? 'Revoke Gov Certification' :
            adminRole === 'ngo' ? 'Remove from NGO' :
                'Ban from Platform'

    const deregDesc =
        adminRole === 'govt'
            ? `Remove the Government Certified badge from ${volunteer.full_name}. Rule: rating < 3 AND total calls ≥ 50.`
            : adminRole === 'ngo'
                ? `Remove ${volunteer.full_name} from your NGO roster. Rule: rating < 3 AND total calls ≥ 50.`
                : `Permanently ban ${volunteer.full_name} from the Aidly platform. Rule: rating < 3 AND total calls ≥ 50.`

    return (
        <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
            <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Volunteer Profile</DialogTitle>
                </DialogHeader>

                {/* Hero row */}
                <div className="flex items-start gap-4 mt-2">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                        {volunteer.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold">{volunteer.full_name}</h2>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{volunteer.email}</span>
                        </div>
                        {volunteer.ngo_name && (
                            <p className="text-sm text-muted-foreground mt-0.5">Affiliated: {volunteer.ngo_name}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {volunteer.govt_certified && <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Gov Certified</Badge>}
                            {volunteer.ngo_certified && <Badge variant="secondary">NGO Certified</Badge>}
                            <Badge variant={volunteer.available_now ? 'success' : 'outline'} className="gap-1">
                                <Activity className="h-3 w-3" />
                                {volunteer.available_now ? 'Available Now' : 'Offline'}
                            </Badge>
                            <Badge variant={volunteer.duty_mode ? 'default' : 'outline'} className="gap-1">
                                <Clock className="h-3 w-3" />
                                {volunteer.duty_mode ? 'On Duty' : 'Off Duty'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border p-4 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span className={`text-2xl font-bold ${volunteer.rating_avg < 3 ? 'text-destructive' : ''}`}>
                                {volunteer.rating_avg}
                            </span>
                        </div>
                        <StarRow rating={volunteer.rating_avg} />
                        <p className="text-xs text-muted-foreground mt-1">Average Rating</p>
                    </div>
                    <div className="rounded-xl border p-4 text-center">
                        <Phone className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                        <div className={`text-2xl font-bold ${volunteer.total_calls >= 50 && volunteer.rating_avg < 3 ? 'text-destructive' : ''}`}>
                            {volunteer.total_calls}
                        </div>
                        <p className="text-xs text-muted-foreground">Total Calls</p>
                    </div>
                    <div className="rounded-xl border p-4 text-center">
                        <div className="text-2xl font-bold">{feedbacks.length}</div>
                        <p className="text-xs text-muted-foreground">Reviews</p>
                    </div>
                </div>

                {/* Risk notice */}
                {eligible && (
                    <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive font-medium">
                            This volunteer meets the deregistration criteria: rating below 3 with 50+ calls.
                        </p>
                    </div>
                )}

                {/* Skills & Crisis Tags */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {volunteer.skills.map(s => (
                                <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Crisis Tags</p>
                        <div className="flex flex-wrap gap-1.5">
                            {volunteer.crisis_tags.map(t => (
                                <Badge key={t} variant="secondary" className="text-xs capitalize">{t}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Feedback / Reviews */}
                <div>
                    <p className="text-sm font-semibold mb-3">Caller Feedback ({feedbacks.length} reviews)</p>
                    {feedbacks.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No feedback for this volunteer yet.</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {feedbacks.map(fb => (
                                <div key={fb.id} className="rounded-lg border p-3 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                {fb.rated_by[0]}
                                            </div>
                                            <span className="text-sm font-medium">{fb.rated_by}</span>
                                            <Badge variant="outline" className="text-xs">{fb.call_type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`h-3 w-3 ${s <= fb.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{fb.feedback}</p>
                                    <p className="text-xs text-muted-foreground">{fb.created_at}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Deregister action */}
                {onDeregister && (
                    <>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Deregistration</p>
                                <p className="text-xs text-muted-foreground">Enabled when rating &lt; 3 AND total calls ≥ 50</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant={eligible ? 'destructive' : 'outline'}
                                        size="sm"
                                        disabled={!eligible}
                                        className="gap-1.5"
                                    >
                                        <ShieldOff className="h-4 w-4" />
                                        {deregLabel}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{deregLabel}?</AlertDialogTitle>
                                        <AlertDialogDescription>{deregDesc}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive hover:bg-destructive/90"
                                            onClick={() => { onDeregister(volunteer.id); onClose() }}
                                        >
                                            Confirm {deregLabel}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
