import { getCollections } from '../actions/inventory'
import Link from 'next/link'
import { Library, Plus, ChevronRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { CreateCollectionDialog } from '@/components/collections/create-collection-dialog'

export default async function CollectionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const collections = await getCollections()

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b transition-all duration-300">
                <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Link href="/" className="hover:opacity-80 transition-all duration-200 hover:scale-105 truncate">
                            <h1 className="text-base sm:text-xl font-bold tracking-tight">MangaKeep</h1>
                        </Link>
                        <ChevronRight className="text-muted-foreground flex-shrink-0" size={14} />
                        <span className="font-semibold text-sm sm:text-base truncate">Collections</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <h2 className="text-xl sm:text-2xl font-bold">My Collections</h2>
                    <CreateCollectionDialog />
                </div>

                {collections.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-primary/5 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                            <Library size={32} className="sm:w-12 sm:h-12 opacity-50 text-primary" />
                        </div>
                        <p className="text-base sm:text-lg font-medium">No collections yet</p>
                        <p className="text-xs sm:text-sm mt-1">Create a collection when adding a new volume.</p>
                        <Link href="/" className="inline-block mt-4 text-primary hover:underline text-sm font-medium transition-all duration-200 hover:scale-105">
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {collections.map((collection: any, index: number) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.id}`}
                                className="group block p-4 sm:p-6 bg-card border rounded-lg hover:shadow-md transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 zoom-in-95"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        <Library size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-muted-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                                        {collection.user_volumes?.[0]?.count || 0} volumes
                                    </span>
                                </div>
                                <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-2">{collection.name}</h3>
                                <p className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                                    Created {new Date(collection.created_at).toLocaleDateString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
