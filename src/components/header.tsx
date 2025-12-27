import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { Library } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { UserNav } from './user-nav'

import { Logo } from '@/components/logo'

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                        <Logo />
                        {/* Text Hidden on Mobile */}
                        <h1 className="hidden sm:block text-base sm:text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                            MangaKeep
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                    <Link
                        href="/collections"
                        className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-secondary/50 flex items-center gap-2"
                        title="Collections"
                    >
                        {/* Icon Visible on Mobile */}
                        <Library size={20} className="sm:hidden" />

                        {/* Text Visible on Desktop */}
                        <span className="hidden sm:inline">Collections</span>
                    </Link>
                    <ModeToggle />
                    <div className="hidden sm:block w-px h-6 bg-border/50" />
                    <UserNav user={user} />
                </div>
            </div>
        </header>
    )
}
