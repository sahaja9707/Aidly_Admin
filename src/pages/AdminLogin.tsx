import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 700))
        setLoading(false)
        navigate('/ngo/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/ngo-admin-hub')} className="gap-1.5 -ml-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Card className="border-2">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <Badge variant="secondary" className="mx-auto mb-2">NGO Admin</Badge>
                        <CardTitle className="text-xl">Welcome Back</CardTitle>
                        <CardDescription>Sign in to your NGO admin account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" placeholder="you@ngo.org" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input id="password" type={showPw ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPw(!showPw)}>
                                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <Separator />
                        <p className="text-xs text-muted-foreground text-center">
                            Don't have an account?{' '}
                            <button className="text-primary underline-offset-2 hover:underline" onClick={() => navigate('/admin-signup')}>
                                Register your NGO
                            </button>
                        </p>
                    </CardFooter>
                </Card>
                <Card className="bg-muted/40 border-dashed"><CardContent className="py-3 px-4">
                    <p className="text-xs text-muted-foreground text-center"><span className="font-medium">Demo:</span> Any email & password works</p>
                </CardContent></Card>
            </div>
        </div>
    )
}
