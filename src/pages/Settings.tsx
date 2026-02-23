import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
    Sun, Moon, Bell, Lock, User, Globe,
    ShieldCheck, Save, Eye, EyeOff,
} from 'lucide-react'

interface ToggleProps {
    checked: boolean
    onToggle: () => void
    id: string
}

function Toggle({ checked, onToggle, id }: ToggleProps) {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}
        >
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    )
}

type TabId = 'appearance' | 'profile' | 'notifications' | 'security'

const TABS: { id: TabId; label: string; icon: typeof Sun }[] = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
]

export default function Settings() {
    const { theme, setTheme } = useTheme()
    const [activeTab, setActiveTab] = useState<TabId>('appearance')

    // Profile state
    const [profile, setProfile] = useState({ fullName: 'Admin User', email: 'admin@aidly.in', phone: '', org: 'Aidly Platform' })
    const [profileSaved, setProfileSaved] = useState(false)

    // Notifications
    const [notifs, setNotifs] = useState({
        emailAlerts: true,
        registrationApprovals: true,
        volunteerActivity: false,
        weeklyDigest: true,
        disasterAlerts: true,
        systemUpdates: false,
    })
    const toggleNotif = (key: keyof typeof notifs) => setNotifs(n => ({ ...n, [key]: !n[key] }))

    // Security
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const [pwSaved, setPwSaved] = useState(false)
    // Session toggles (lifted out of map to respect Rules of Hooks)
    const [autoLogout, setAutoLogout] = useState(true)
    const [loginAlerts, setLoginAlerts] = useState(true)

    const saveProfile = () => {
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 2000)
    }
    const savePw = (e: React.FormEvent) => {
        e.preventDefault()
        setPwSaved(true)
        setPwForm({ current: '', next: '', confirm: '' })
        setTimeout(() => setPwSaved(false), 2000)
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences and platform settings</p>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 border-b overflow-x-auto pb-0">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* ─── Appearance ──────────────────────────────────────────────── */}
            {activeTab === 'appearance' && (
                <div className="space-y-4">
                    {/* Theme Big Toggle */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                Theme
                            </CardTitle>
                            <CardDescription>Choose how the Aidly Admin Portal looks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                {/* Light card */}
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Sun className="h-5 w-5 text-amber-500" />
                                        {theme === 'light' && <Badge variant="default" className="text-xs">Active</Badge>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-full rounded bg-foreground/10" />
                                        <div className="h-2 w-3/4 rounded bg-foreground/10" />
                                        <div className="h-2 w-1/2 rounded bg-foreground/10" />
                                    </div>
                                    <p className="text-sm font-medium mt-3">Light</p>
                                </button>
                                {/* Dark card */}
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 rounded-xl border-2 p-4 text-left transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Moon className="h-5 w-5 text-blue-400" />
                                        {theme === 'dark' && <Badge variant="default" className="text-xs">Active</Badge>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-full rounded bg-white/20" />
                                        <div className="h-2 w-3/4 rounded bg-white/20" />
                                        <div className="h-2 w-1/2 rounded bg-white/20" />
                                    </div>
                                    <p className="text-sm font-medium mt-3">Dark</p>
                                </button>
                            </div>

                            {/* Inline quick toggle */}
                            <div className="mt-5 flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-2">
                                    {theme === 'dark' ? <Moon className="h-4 w-4 text-blue-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                                    <span className="text-sm font-medium">Dark Mode</span>
                                </div>
                                <Toggle id="dark-mode" checked={theme === 'dark'} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* UI Density */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Globe className="h-4 w-4" /> Language & Region
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                                    <span className="text-sm">English (India)</span>
                                    <Badge variant="outline" className="text-xs">Default</Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Timezone</Label>
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                                    <span className="text-sm">Asia/Kolkata (IST, UTC+5:30)</span>
                                    <Badge variant="outline" className="text-xs">Auto</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Profile ─────────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4" /> Profile Details
                        </CardTitle>
                        <CardDescription>Update your name and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                                {profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <p className="font-medium">{profile.fullName}</p>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                                <Badge variant="secondary" className="mt-1 text-xs">Admin</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fname">Full Name</Label>
                                <Input id="fname" value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="femail">Email</Label>
                                <Input id="femail" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fphone">Phone</Label>
                                <Input id="fphone" placeholder="+91-XXXXXXXXXX" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="forg">Organisation</Label>
                                <Input id="forg" value={profile.org} disabled className="bg-muted/40" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={saveProfile} className="gap-2">
                                <Save className="h-4 w-4" /> Save Changes
                            </Button>
                            {profileSaved && <span className="text-sm text-green-600 font-medium">✓ Profile saved!</span>}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ─── Notifications ───────────────────────────────────────────── */}
            {activeTab === 'notifications' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Bell className="h-4 w-4" /> Notification Preferences
                            </CardTitle>
                            <CardDescription>Choose what activity you want to be notified about</CardDescription>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {[
                                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive all notifications via email' },
                                { key: 'registrationApprovals', label: 'Registration Approvals', desc: 'New admin registration requests' },
                                { key: 'volunteerActivity', label: 'Volunteer Activity', desc: 'New joins, deregistrations, and status changes' },
                                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of platform activity each Monday' },
                                { key: 'disasterAlerts', label: 'Disaster Alerts', desc: 'Push notification for new disaster alerts' },
                                { key: 'systemUpdates', label: 'System Updates', desc: 'Maintenance windows and platform changes' },
                            ].map(item => (
                                <div key={item.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Toggle
                                        id={`notif-${item.key}`}
                                        checked={notifs[item.key as keyof typeof notifs]}
                                        onToggle={() => toggleNotif(item.key as keyof typeof notifs)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Security ────────────────────────────────────────────────── */}
            {activeTab === 'security' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Change Password
                            </CardTitle>
                            <CardDescription>Use a strong password with at least 8 characters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={savePw} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pw-current">Current Password</Label>
                                    <div className="relative">
                                        <Input id="pw-current" type={showCurrent ? 'text' : 'password'} placeholder="Current password"
                                            value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} required className="pr-10" />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pw-new">New Password</Label>
                                    <div className="relative">
                                        <Input id="pw-new" type={showNext ? 'text' : 'password'} placeholder="New password (min 8 chars)"
                                            value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} required className="pr-10" />
                                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowNext(!showNext)}>
                                            {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pw-confirm">Confirm New Password</Label>
                                    <Input id="pw-confirm" type="password" placeholder="Repeat new password"
                                        value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} required />
                                    {pwForm.confirm.length > 0 && pwForm.next !== pwForm.confirm && (
                                        <p className="text-xs text-destructive">Passwords do not match</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button type="submit" disabled={pwForm.next !== pwForm.confirm || pwForm.next.length < 8} className="gap-2">
                                        <Save className="h-4 w-4" /> Update Password
                                    </Button>
                                    {pwSaved && <span className="text-sm text-green-600 font-medium">✓ Password updated!</span>}
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Session & Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            <div className="flex items-center justify-between py-4 pb-4">
                                <div>
                                    <p className="text-sm font-medium">Auto-logout after inactivity</p>
                                    <p className="text-xs text-muted-foreground">30 minutes of inactivity will sign you out</p>
                                </div>
                                <Toggle id="sec-autologout" checked={autoLogout} onToggle={() => setAutoLogout(v => !v)} />
                            </div>
                            <div className="flex items-center justify-between py-4 pt-4">
                                <div>
                                    <p className="text-sm font-medium">Login activity alerts</p>
                                    <p className="text-xs text-muted-foreground">Email me when a new login is detected</p>
                                </div>
                                <Toggle id="sec-loginalerts" checked={loginAlerts} onToggle={() => setLoginAlerts(v => !v)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/40">
                        <CardHeader>
                            <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Sign Out Everywhere</p>
                                    <p className="text-xs text-muted-foreground">Invalidate all active sessions for your account</p>
                                </div>
                                <Button variant="destructive" size="sm">Sign Out All Devices</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
