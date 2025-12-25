import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { LogOut, Library } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-start gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                            <span className="text-base sm:text-lg font-bold text-primary">M</span>
                        </div>
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
                    <form action={async () => {
                        'use server'
                        const supabase = await createClient()
                        await supabase.auth.signOut()
                        redirect('/login')
                    }}>
                        <button
                            title="Sign Out"
                            className="p-1.5 sm:p-2 hover:bg-secondary rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-110"
                        >
                            <LogOut size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </header>
    )
}
