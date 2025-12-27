'use client'

import { LogOut, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface UserNavProps {
    user: {
        email?: string
        user_metadata?: {
            avatar_url?: string
            full_name?: string
            name?: string
        }
    } | null
}

export function UserNav({ user }: UserNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const avatarUrl = user?.user_metadata?.avatar_url
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0]

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
                <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border flex items-center justify-center">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={16} className="text-muted-foreground" />
                    )}
                </div>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in zoom-in-95 z-50 p-1">
                        <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1">
                            <p className="truncate">{name}</p>
                            <p className="text-xs font-normal text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        >
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
