import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function GOAdminPasswordSetup() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const strong = password.length >= 8
    const match = password === confirm && confirm.length > 0

    const handle = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!strong || !match) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 700))
        setLoading(false)
        navigate('/admin-pending-request')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/gov-admin-signup')} className="gap-1.5 -ml-2">
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
                        <CardTitle className="text-xl">Set Your Password</CardTitle>
                        <CardDescription>Create a secure password for your Government admin account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handle} className="space-y-4">
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <div className="relative">
                                    <Input type={show ? 'text' : 'password'} placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required className="pr-10" />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShow(!show)}>
                                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <p className={`text-xs ${strong ? 'text-green-600' : 'text-destructive'}`}>
                                        {strong ? '✓ Strong password' : '✗ At least 8 characters required'}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <Input type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                                {confirm.length > 0 && (
                                    <p className={`text-xs flex items-center gap-1 ${match ? 'text-green-600' : 'text-destructive'}`}>
                                        {match ? <><CheckCircle className="h-3 w-3" />Passwords match</> : '✗ Passwords do not match'}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={!strong || !match || loading}>
                                {loading ? 'Setting password...' : 'Set Password & Submit'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-xs text-center text-muted-foreground">
                    Your registration will proceed for Super Admin review after this step.
                </p>
            </div>
        </div>
    )
}
