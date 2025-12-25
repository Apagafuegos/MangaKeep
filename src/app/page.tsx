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
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">M</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              MangaKeep
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/collections" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Collections
            </Link>
            <ModeToggle />
            <div className="w-px h-6 bg-border/50" />
            <form action={async () => {
              'use server'
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect('/login')
            }}>
              <button
                title="Sign Out"
                className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Actions Area */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card/50 p-6 rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Collection</h2>
            <p className="text-muted-foreground mt-1 text-lg">Manage and track your manga volumes.</p>
          </div>
          <AddVolumeForm />
        </section>

        {/* Library Content */}
        <LibraryGrid initialVolumes={volumes || []} />
      </main>
    </div>
  )
}
