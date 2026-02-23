import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Shield, ArrowLeft } from 'lucide-react'

export default function GOAdminSignup() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ fullName: '', email: '', bodyName: '', state: '', designation: '' })
    const [loading, setLoading] = useState(false)

    const handle = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        navigate('/gov-admin-password-setup')
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
                        <CardTitle className="text-xl">Register Government Body</CardTitle>
                        <CardDescription>Submit your details for Super Admin review and official verification.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handle} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Full Name *</Label>
                                    <Input placeholder="Your name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Designation *</Label>
                                    <Input placeholder="e.g. District Collector" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Official Email *</Label>
                                <Input type="email" placeholder="you@state.gov.in" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Government Body Name *</Label>
                                <Input placeholder="e.g. Kerala SDMA" value={form.bodyName} onChange={e => setForm(f => ({ ...f, bodyName: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>State *</Label>
                                <Input placeholder="e.g. Kerala" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
                            </div>
                            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                                Government registrations require offline credential verification. You'll be notified via official email within 2–3 business days.
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-xs text-center text-muted-foreground">
                    Already registered?{' '}
                    <button className="text-primary hover:underline underline-offset-2" onClick={() => navigate('/gov-admin-login')}>
                        Sign in instead
                    </button>
                </p>
            </div>
        </div>
    )
}
