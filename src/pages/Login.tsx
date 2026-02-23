import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, Building2, Star, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { signIn, signOut, supabase } from '@/lib/supabase'

const roleConfig = {
    govt: { label: 'Government Admin', icon: Shield, badge: 'Official', color: 'default' as const },
    ngo: { label: 'NGO Admin', icon: Building2, badge: 'Partner', color: 'secondary' as const },
    super: { label: 'Super Admin', icon: Star, badge: 'Aidly Core', color: 'outline' as const },
}

export default function Login() {
    const { role } = useParams<{ role: string }>()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const config = roleConfig[role as keyof typeof roleConfig] ?? roleConfig.govt
    const Icon = config.icon

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error: authError } = await signIn(email, password)
        if (authError || !data.user) {
            setError('Invalid email or password.')
            setLoading(false)
            return
        }

        const { data: userRow, error: dbError } = await supabase
            .from('users')
            .select('role, is_suspended, is_active')
            .eq('id', data.user.id)
            .single()

        if (dbError) {
            console.error('[Login] users table query failed:', dbError)
            setError(`DB error: ${dbError.message} (code: ${dbError.code})`)
            await signOut()
            setLoading(false)
            return
        }

        if (!userRow) {
            setError('Account not found. Contact your Super Admin.')
            await signOut()
            setLoading(false)
            return
        }

        if (userRow.is_suspended || !userRow.is_active) {
            setError('Your account has been suspended or deactivated.')
            await signOut()
            setLoading(false)
            return
        }

        setLoading(false)

        const r = userRow.role
        if (role === 'super' && (r === 'super' || r === 'super_admin')) return navigate('/super/dashboard')
        if (role === 'govt' && (r === 'govt' || r === 'govt_admin')) return navigate('/gov/dashboard')
        if (role === 'ngo' && (r === 'ngo' || r === 'ngo_admin')) return navigate('/ngo/dashboard')

        setError(`This login is for ${config.label} only.`)
        await signOut()
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Back */}
                <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5 -ml-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Role Selection
                </Button>

                <Card className="border-2">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <Icon className="h-7 w-7 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-center mb-2">
                            <Badge variant={config.color}>{config.badge}</Badge>
                        </div>
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to your <span className="font-medium text-foreground">{config.label}</span> account
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@organisation.gov.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                        <p className="text-center text-xs text-muted-foreground leading-relaxed">
                            Don't have access yet? Contact your Super Admin to register your organisation.
                            New registrations require offline verification and Super Admin approval.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
