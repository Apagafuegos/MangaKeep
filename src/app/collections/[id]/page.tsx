import { getCollectionDetails } from '@/app/actions/inventory'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react'
import { redirect, notFound } from 'next/navigation'
import { VolumeCard } from '@/components/dashboard/volume-card' // Reuse volume card? Yes, but maybe simpler list? Reuse for consistency.

export default async function CollectionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const data = await getCollectionDetails(id)

    if (!data) notFound()

    const { collection, volumes } = data

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center gap-2">
                    <Link href="/collections" className="hover:bg-muted p-2 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">Dashboard</Link>
                        <ChevronRight size={14} />
                        <Link href="/collections" className="hover:text-foreground">Collections</Link>
                        <ChevronRight size={14} />
                        <span className="font-medium text-foreground">{collection.name}</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{collection.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            Created {new Date(collection.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{volumes.length} Volumes</span>
                    </div>
                </div>

                {volumes.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No volumes in this collection yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {volumes.map((vol) => (
                            <VolumeCard
                                key={vol.id}
                                volume={vol}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
