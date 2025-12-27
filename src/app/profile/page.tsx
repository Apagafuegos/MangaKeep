
import { CsvImporter } from '@/components/import/csv-importer'
import { Header } from '@/components/header'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getLibrary } from '../actions/inventory'
import { User, Book, Mail } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const volumes = await getLibrary()
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
    const avatarUrl = user.user_metadata?.avatar_url

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <h1 className="text-3xl font-bold">Profile</h1>

                {/* User Card */}
                <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-muted/30 shrink-0">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <h2 className="text-2xl font-bold">{name}</h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        <div className="pt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
                            <div className="bg-secondary/50 px-4 py-2 rounded-lg flex items-center gap-2">
                                <Book className="text-primary" size={20} />
                                <span className="font-semibold">{volumes ? volumes.length : 0}</span>
                                <span className="text-muted-foreground text-sm">Books Collected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Import Section */}
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Data Management</h3>
                        <p className="text-muted-foreground text-sm">Manage your library data.</p>
                    </div>

                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-muted/20">
                            <h4 className="font-semibold flex items-center gap-2">
                                <span className="w-2 h-8 bg-primary rounded-full" />
                                Import Library
                            </h4>
                            <p className="text-sm text-muted-foreground mt-2">
                                Import your manga collection from a CSV file. This will add new volumes to your library.
                            </p>
                        </div>
                        <div className="p-6">
                            <CsvImporter />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
