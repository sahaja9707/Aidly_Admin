import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogIn, UserPlus, ArrowRight } from 'lucide-react'

export default function GOAdminHub() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="gap-1.5 -ml-2 mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin Type Selection
                </Button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Government Admin Portal
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage disaster response and coordinate volunteer efforts
                    </p>
                </div>

                {/* CTA Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Login Option */}
                    <button
                        onClick={() => navigate('/gov-admin-login')}
                        className="group relative overflow-hidden rounded-xl border-2 border-border p-8 transition-all duration-200 hover:border-primary hover:shadow-lg bg-card"
                    >
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                        <div className="relative flex flex-col items-center text-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <LogIn className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Existing Admin?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Sign in to your account
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                Log In
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </button>

                    {/* Signup Option */}
                    <button
                        onClick={() => navigate('/gov-admin-signup')}
                        className="group relative overflow-hidden rounded-xl border-2 border-primary/50 p-8 transition-all duration-200 hover:border-primary hover:shadow-lg bg-primary/5"
                    >
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/15 transition-colors" />
                        <div className="relative flex flex-col items-center text-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                                <UserPlus className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">New Department?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Register your government department
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                Sign Up
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
