import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signIn, signOut, supabase } from '@/lib/supabase'

export default function GOAdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handle = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error: authError } = await signIn(email, password)
        if (authError || !data.user) {
            setError('Invalid email or password.')
            setLoading(false)
            return
        }

        const { data: userRow } = await supabase
            .from('users')
            .select('role, is_suspended, is_active')
            .eq('id', data.user.id)
            .single()

        if (!userRow || (userRow.role !== 'govt' && userRow.role !== 'govt_admin')) {
            setError('No Government admin account found for this email.')
            await signOut()
            setLoading(false)
            return
        }

        if (userRow.is_suspended || !userRow.is_active) {
            setError('Your account has been suspended. Contact support.')
            await signOut()
            setLoading(false)
            return
        }

        setLoading(false)
        navigate('/gov/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/gov-admin-hub')} className="gap-1.5 -ml-2">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Card className="border-2">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <Badge variant="default" className="mx-auto mb-2">Government Official</Badge>
                        <CardTitle className="text-xl">Government Admin Sign In</CardTitle>
                        <CardDescription>Access your government body's admin panel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handle} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gov-email">Official Email</Label>
                                <Input id="gov-email" type="email" placeholder="you@state.gov.in" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gov-pw">Password</Label>
                                <div className="relative">
                                    <Input id="gov-pw" type={showPw ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPw(!showPw)}>
                                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                        {error && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <Separator />
                        <p className="text-xs text-muted-foreground text-center">
                            First time?{' '}
                            <button className="text-primary underline-offset-2 hover:underline" onClick={() => navigate('/gov-admin-signup')}>
                                Register your government body
                            </button>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
