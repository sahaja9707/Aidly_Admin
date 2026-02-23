import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

type Role = 'govt' | 'ngo' | 'super'

const roleConfig: Record<Role, { name: string; org: string; initials: string }> = {
    govt: { name: 'Raj Mohan', org: 'Kerala SDMA', initials: 'RM' },
    ngo: { name: 'Anita Roy', org: 'HelpIndia NGO', initials: 'AR' },
    super: { name: 'Super Admin', org: 'Aidly Core Team', initials: 'SA' },
}

export function TopBar({ role, title }: { role: Role; title: string }) {
    const navigate = useNavigate()
    const config = roleConfig[role]

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            {/* Page title */}
            <div className="flex-1">
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{config.initials}</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-medium leading-none">{config.name}</span>
                                <span className="text-xs text-muted-foreground leading-none mt-0.5">{config.org}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div>
                                <p className="font-medium">{config.name}</p>
                                <p className="text-xs text-muted-foreground font-normal">{config.org}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                        <DropdownMenuItem>Notifications</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => navigate('/')}
                        >
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Role badge - visible only on larger screens */}
                <Badge variant={role === 'super' ? 'default' : role === 'govt' ? 'secondary' : 'outline'} className="hidden lg:flex">
                    {role === 'govt' ? 'Gov Admin' : role === 'ngo' ? 'NGO Admin' : 'Super Admin'}
                </Badge>
            </div>
        </header>
    )
}
