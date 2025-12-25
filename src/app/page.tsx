import { getLibrary } from './actions/inventory'
import { AddVolumeForm } from '@/components/dashboard/add-volume-form'
import { LibraryGrid } from '@/components/dashboard/library-grid'
import { createClient } from '@/utils/supabase/server'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const volumes = await getLibrary()

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Background Gradient Accent */}
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110">
              <span className="text-base sm:text-lg font-bold text-primary">M</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
              MangaKeep
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link 
              href="/collections" 
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-secondary/50"
            >
              <span className="hidden sm:inline">Collections</span>
              <span className="sm:hidden">Coll.</span>
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

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Actions Area */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 bg-card/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight transition-all duration-200">My Collection</h2>
            <p className="text-muted-foreground mt-1 text-sm sm:text-lg">Manage and track your manga volumes.</p>
          </div>
          <AddVolumeForm />
        </section>

        {/* Library Content */}
        <LibraryGrid initialVolumes={volumes || []} />
      </main>
    </div>
  )
}
