import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Mail, CheckCircle, ArrowLeft } from 'lucide-react'

const steps = [
    { label: 'Registration submitted', done: true },
    { label: 'Password set up', done: true },
    { label: 'Super Admin receives your request', done: true },
    { label: 'Offline verification of credentials', done: false },
    { label: 'Admin account activated', done: false },
]

export default function AdminPendingRequest() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-lg space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5 -ml-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>

                <Card className="border-2">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-200">
                                <Clock className="h-8 w-8 text-amber-600" />
                            </div>
                        </div>
                        <Badge variant="warning" className="mx-auto mb-2 w-fit">Pending Review</Badge>
                        <CardTitle className="text-2xl">Registration Submitted</CardTitle>
                        <CardDescription className="text-base leading-relaxed mt-1">
                            Your admin registration has been submitted successfully.
                            A Super Admin will review your credentials and activate your account after offline verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Steps */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide text-xs">Verification Steps</p>
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${step.done
                                            ? 'bg-primary text-primary-foreground'
                                            : 'border-2 border-muted-foreground/30 text-muted-foreground'
                                        }`}>
                                        {step.done ? <CheckCircle className="h-4 w-4" /> : i + 1}
                                    </div>
                                    <span className={`text-sm ${step.done ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        {/* Timeline */}
                        <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                            <p className="text-sm font-medium">Expected Timeline</p>
                            <p className="text-sm text-muted-foreground">Typically 2–3 business days for offline verification.</p>
                            <p className="text-sm text-muted-foreground">You will be notified via your registered email once your account is activated.</p>
                        </div>

                        {/* Contact */}
                        <div className="rounded-lg border p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Need help?</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Contact the Aidly Super Admin team:</p>
                            <p className="text-sm font-medium text-primary">admin@aidly.in</p>
                        </div>

                        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                            Return to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
