import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function GOAdminLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        setLoading(true)
        // Simulate auth delay
        await new Promise(r => setTimeout(r, 1200))
        setLoading(false)

        // TODO: Replace with actual API call
        // For now, navigate to Government dashboard on successful login
        navigate('/gov/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="gap-1.5 -ml-2 mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Landing
                </Button>

                {/* Card */}
                <Card>
                    <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-4">
                            <span className="text-sm font-bold text-primary-foreground">A</span>
                        </div>
                        <CardTitle className="text-2xl">Government Admin Login</CardTitle>
                        <CardDescription>
                            Sign in to your admin account with your email and password
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@government.gov.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {/* Submit */}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <Separator />

                            {/* Signup Link */}
                            <div className="text-center text-sm">
                                <p className="text-muted-foreground">
                                    New Government Admin?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/gov-admin-signup')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Text */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p className="mb-2">Need help logging in?</p>
                    <button className="text-primary hover:underline">
                        Contact Super Admin Support
                    </button>
                </div>
            </div>
        </div>
    )
}
