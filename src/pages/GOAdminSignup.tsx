import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function GOAdminSignup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)

    const [formData, setFormData] = useState({
        // Government Details
        departmentName: '',
        city: '',
        pincode: '',
        
        // Admin Contact Details
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        designation: '',
        adminDescription: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateStep1 = () => {
        if (!formData.departmentName.trim()) {
            setError('Department name is required')
            return false
        }
        if (!formData.city.trim()) {
            setError('City is required')
            return false
        }
        if (!formData.pincode.trim()) {
            setError('Pincode is required')
            return false
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            setError('Please enter a valid 6-digit pincode')
            return false
        }
        return true
    }

    const validateStep2 = () => {
        if (!formData.adminName.trim()) {
            setError('Admin name is required')
            return false
        }
        if (!formData.adminEmail.trim()) {
            setError('Email is required')
            return false
        }
        if (!formData.adminEmail.includes('@')) {
            setError('Please enter a valid email address')
            return false
        }
        if (!formData.adminPhone.trim()) {
            setError('Phone number is required')
            return false
        }
        if (!/^\d{10}$/.test(formData.adminPhone.replace(/\D/g, ''))) {
            setError('Please enter a valid 10-digit phone number')
            return false
        }
        if (!formData.designation.trim()) {
            setError('Designation is required')
            return false
        }
        return true
    }

    const handleNextStep = () => {
        setError('')
        if (step === 1) {
            if (validateStep1()) {
                setStep(2)
            }
        }
    }

    const handlePreviousStep = () => {
        setError('')
        setStep(1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateStep2()) {
            return
        }

        setLoading(true)
        // Simulate submission delay
        await new Promise(r => setTimeout(r, 1500))
        setLoading(false)

        // TODO: Replace with actual API call to submit Government Admin request
        // On success, navigate directly to password setup (assuming super admin approved)
        navigate('/gov-admin-password-setup', { state: { departmentName: formData.departmentName } })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-8">
            <div className="w-full max-w-2xl">
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

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-4">
                            <span className="text-sm font-bold text-primary-foreground">A</span>
                        </div>
                        <CardTitle className="text-2xl">Register Your Government Department</CardTitle>
                        <CardDescription>
                            {step === 1
                                ? 'Step 1 of 2 — Enter your department details and location information'
                                : 'Step 2 of 2 — Provide admin contact information'}
                        </CardDescription>

                        {/* Progress */}
                        <div className="mt-6 flex gap-2">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 flex-1 rounded-full transition-colors ${
                                        step >= s ? 'bg-primary' : 'bg-secondary'
                                    }`}
                                />
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 ? (
                                <>
                                    {/* Step 1: Government Department Details */}
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="departmentName">Department Name *</Label>
                                        <Input
                                            id="departmentName"
                                            name="departmentName"
                                            placeholder="e.g., Disaster Management Department"
                                            value={formData.departmentName}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City / District *</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                placeholder="e.g., Mumbai, Delhi"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode *</Label>
                                            <Input
                                                id="pincode"
                                                name="pincode"
                                                placeholder="6-digit pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Step 2: Admin Contact Details */}
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="adminName">Admin Name *</Label>
                                        <Input
                                            id="adminName"
                                            name="adminName"
                                            placeholder="Full name of the admin"
                                            value={formData.adminName}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="adminEmail">Email Address *</Label>
                                            <Input
                                                id="adminEmail"
                                                name="adminEmail"
                                                type="email"
                                                placeholder="admin@department.gov.in"
                                                value={formData.adminEmail}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="adminPhone">Phone Number *</Label>
                                            <Input
                                                id="adminPhone"
                                                name="adminPhone"
                                                placeholder="10-digit phone number"
                                                value={formData.adminPhone}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                                maxLength={15}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation / Position *</Label>
                                        <Input
                                            id="designation"
                                            name="designation"
                                            placeholder="e.g., District Chief, Officer"
                                            value={formData.designation}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adminDescription">About the Admin (Optional)</Label>
                                        <Textarea
                                            id="adminDescription"
                                            name="adminDescription"
                                            placeholder="Brief description of the admin's role and experience"
                                            value={formData.adminDescription}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            rows={4}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex gap-2">
                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                    <p className="text-sm text-destructive">{error}</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <Separator className="my-6" />
                            <div className="flex gap-3">
                                {step === 2 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePreviousStep}
                                        disabled={loading}
                                    >
                                        Previous
                                    </Button>
                                )}
                                {step === 1 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={loading}
                                        className="flex-1"
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={loading} className="flex-1">
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Sending Request...
                                            </>
                                        ) : (
                                            'Send Request to Super Admin'
                                        )}
                                    </Button>
                                )}
                            </div>

                            {/* Support */}
                            <div className="text-center text-xs text-muted-foreground">
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/gov-admin-login')}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign in
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
