import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Building2, ArrowLeft, AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { createRegistration } from '@/lib/supabase'

export default function AdminSignup() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ fullName: '', email: '', orgName: '', regNo: '', phone: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handle = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error: dbError } = await createRegistration({
            full_name: form.fullName,
            email: form.email,
            requested_role: 'ngo_admin',
            org_name: form.orgName,
        })

        if (dbError) {
            setError('Registration failed. Please try again or check if your email is already registered.')
            setLoading(false)
            return
        }

        sessionStorage.setItem('aidly_signup_email', form.email)
        setLoading(false)
        navigate('/admin-password-setup')
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
                        <CardTitle className="text-xl">Register Your NGO</CardTitle>
                        <CardDescription>Submit your details for Super Admin review and offline verification.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handle} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Full Name *</Label>
                                    <Input placeholder="Your name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Official Email *</Label>
                                    <Input type="email" placeholder="you@ngo.org" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Organisation Name *</Label>
                                <Input placeholder="e.g. Helping Hands India" value={form.orgName} onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Registration Number *</Label>
                                    <Input placeholder="NGO-XXXX-XXX" value={form.regNo} onChange={e => setForm(f => ({ ...f, regNo: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                                After submission, a Super Admin will review and conduct offline verification before granting access.
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </Button>
                        </form>
                        {error && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <p className="text-xs text-center text-muted-foreground">
                    Already registered?{' '}
                    <button className="text-primary hover:underline underline-offset-2" onClick={() => navigate('/admin-login')}>
                        Sign in instead
                    </button>
                </p>
            </div>
        </div>
    )
}
