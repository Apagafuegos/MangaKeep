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
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <h1 className="text-xl font-bold tracking-tight">MangaKeep</h1>
                        </Link>
                        <ChevronRight className="text-muted-foreground" size={16} />
                        <span className="font-semibold">Collections</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">My Collections</h2>
                    <CreateCollectionDialog />
                </div>

                {collections.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        <Library size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No collections yet</p>
                        <p className="text-sm">Create a collection when adding a new volume.</p>
                        <Link href="/" className="inline-block mt-4 text-primary hover:underline">
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection: any) => (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.id}`}
                                className="group block p-6 bg-card border rounded-lg hover:shadow-md transition-all hover:border-primary/50"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Library size={24} />
                                    </div>
                                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                                        {collection.user_volumes?.[0]?.count || 0} volumes
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{collection.name}</h3>
                                <p className="text-xs text-muted-foreground">
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
