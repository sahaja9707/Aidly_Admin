import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Mail, ArrowLeft, Home } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function PendingRequest() {
    const navigate = useNavigate()
    const location = useLocation()
    const ngoName = location.state?.ngoName || 'Your NGO'
    const [checkEmail, setCheckEmail] = useState(false)

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Request Submitted!</CardTitle>
                        <CardDescription className="text-base">
                            Your NGO registration request has been sent to the Super Admin for verification
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Status Box */}
                        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">NGO Details Recorded</p>
                                        <p className="text-xs text-muted-foreground">
                                            {ngoName} has been registered in our system
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-3" />

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">Awaiting Super Admin Approval</p>
                                        <p className="text-xs text-muted-foreground">
                                            The Super Admin will verify your details (1-3 business days)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium mb-1">Check Your Email</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        A confirmation email has been sent to your registered email address. You'll receive a notification once your request is approved.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium mb-1">Upon Approval</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Once approved, you'll be able to set your admin password and access the dashboard immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Status Badge */}
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-secondary/50">
                            <span className="text-sm font-medium">Registration Status</span>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending Review
                            </Badge>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3 pt-4">
                            <Button
                                onClick={() => setCheckEmail(!checkEmail)}
                                variant="outline"
                                className="w-full"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                {checkEmail ? "Email Sent ✓" : "Resend Email"}
                            </Button>

                            <Button
                                onClick={() => navigate('/')}
                                className="w-full"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Back to Landing
                            </Button>
                        </div>

                        {/* FAQ */}
                        <div className="space-y-3 text-xs">
                            <p className="font-medium">Common Questions:</p>
                            <div className="space-y-2 text-muted-foreground">
                                <div>
                                    <p className="font-medium text-foreground mb-0.5">How long does approval take?</p>
                                    <p>Typically 1-3 business days. We'll notify you via email as soon as it's approved.</p>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground mb-0.5">What if I don't receive the email?</p>
                                    <p>Check your spam folder. You can also request a resend above.</p>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground mb-0.5">Need help?</p>
                                    <p>Contact the Super Admin Support at support@aidly.org</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
