import { getLibrary } from './actions/inventory'
import { AddVolumeForm } from '@/components/dashboard/add-volume-form'
import { LibraryGrid } from '@/components/dashboard/library-grid'
import { createClient } from '@/utils/supabase/server'

import { redirect } from 'next/navigation'

import { Header } from '@/components/header'

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
      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Actions Area */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 bg-card/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight transition-all duration-200">My Mangas</h2>
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
