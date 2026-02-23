import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, LogIn, UserPlus, ArrowLeft } from 'lucide-react'

export default function GOAdminHub() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-5">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5 -ml-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>

                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <Shield className="h-7 w-7 text-primary" />
                        </div>
                    </div>
                    <Badge variant="default" className="mx-auto">Official Government</Badge>
                    <h1 className="text-2xl font-bold">Government Admin Portal</h1>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Certify volunteers, broadcast disaster alerts, and manage your government body's presence on Aidly.
                    </p>
                </div>

                <div className="space-y-3">
                    <Card className="border-2 cursor-pointer hover:border-primary transition-all" onClick={() => navigate('/gov-admin-login')}>
                        <CardHeader className="pb-2 pt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                    <LogIn className="h-4 w-4 text-primary" />
                                </div>
                                <CardTitle className="text-base">Sign In</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-5">
                            <CardDescription>Already registered? Access your Government admin panel.</CardDescription>
                            <Button className="w-full mt-4" onClick={e => { e.stopPropagation(); navigate('/gov-admin-login') }}>
                                Sign In to Gov Panel
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 cursor-pointer hover:border-primary transition-all" onClick={() => navigate('/gov-admin-signup')}>
                        <CardHeader className="pb-2 pt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <CardTitle className="text-base">Register Government Body</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-5">
                            <CardDescription>First time? Submit your government body registration for Super Admin approval.</CardDescription>
                            <Button variant="outline" className="w-full mt-4" onClick={e => { e.stopPropagation(); navigate('/gov-admin-signup') }}>
                                Register Your Body
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    Access is restricted to government officials. All registrations require online + offline verification.
                </p>
            </div>
        </div>
    )
}
