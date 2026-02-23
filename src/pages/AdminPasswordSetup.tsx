import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function AdminPasswordSetup() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const passwordStrength = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }

    const isPasswordStrong = Object.values(passwordStrength).filter(Boolean).length >= 4
    const passwordsMatch = password === confirmPassword && password.length > 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!password || !confirmPassword) {
            setError('Please fill in all password fields')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        if (!isPasswordStrong) {
            setError('Password does not meet strength requirements')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500))
        setLoading(false)

        // TODO: Replace with actual API call to set password
        // On success, navigate to NGO dashboard
        navigate('/ngo/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-4">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl">Set Your Admin Password</CardTitle>
                        <CardDescription>
                            Your NGO registration has been approved! Create a strong password to complete setup.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Admin Password *</Label>
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

                            {/* Password Strength Indicators */}
                            {password && (
                                <div className="space-y-2">
                                    <p className="text-xs font-medium">Password Strength</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'At least 8 characters', met: passwordStrength.minLength },
                                            { label: 'Uppercase letter (A-Z)', met: passwordStrength.hasUpperCase },
                                            { label: 'Lowercase letter (a-z)', met: passwordStrength.hasLowerCase },
                                            { label: 'Number (0-9)', met: passwordStrength.hasNumber },
                                            { label: 'Special character (!@#$%...)', met: passwordStrength.hasSpecial },
                                        ].map((req, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <Check
                                                    className={`h-4 w-4 ${
                                                        req.met ? 'text-green-600' : 'text-muted-foreground'
                                                    }`}
                                                />
                                                <span className="text-xs text-muted-foreground">{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {confirmPassword && (
                                    <p className={`text-xs ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </p>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex gap-2">
                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-xs text-blue-900 leading-relaxed">
                                    This password will be used for all future logins. Make sure to save it securely. You can reset it later from your account settings.
                                </p>
                            </div>

                            <Separator className="my-6" />

                            {/* Submit */}
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading || !isPasswordStrong || !passwordsMatch}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    'Complete Setup & Access Dashboard'
                                )}
                            </Button>

                            {/* Support */}
                            <div className="text-center text-xs text-muted-foreground">
                                <p>
                                    Need help?{' '}
                                    <button
                                        type="button"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Contact Super Admin
                                    </button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
