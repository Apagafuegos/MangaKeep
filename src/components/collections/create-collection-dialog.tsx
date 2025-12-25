'use client'

import { createCollectionWithVolumes, getAllVolumesWithCollectionStatus } from '@/app/actions/inventory'
import { UserVolume } from '@/types'
import { Library, Plus, Search, X, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ExtendedVolume extends UserVolume {
    isInCollection: boolean
}

export function CreateCollectionDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [isPending, setIsPending] = useState(false)

    const [volumes, setVolumes] = useState<ExtendedVolume[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoadingVolumes, setIsLoadingVolumes] = useState(false)

    // Load volumes when dialog opens
    useEffect(() => {
        if (isOpen) {
            setIsLoadingVolumes(true)
            getAllVolumesWithCollectionStatus().then(data => {
                setVolumes(data as unknown as ExtendedVolume[])
                setIsLoadingVolumes(false)
            })
        }
    }, [isOpen])

    const filteredVolumes = volumes.filter(v =>
        v.manga_series?.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const available = filteredVolumes.filter(v => !v.isInCollection)
    const alreadyCollected = filteredVolumes.filter(v => v.isInCollection)

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsPending(true)
        try {
            await createCollectionWithVolumes(name, Array.from(selectedIds))
            toast.success('Collection created')
            setIsOpen(false)
            setName('')
            setSelectedIds(new Set())
        } catch (error) {
            toast.error('Failed to create collection')
        } finally {
            setIsPending(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
                <Plus size={18} />
                New Collection
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Library size={20} />
                        Create Collection
                    </h2>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 space-y-4 flex-1 flex flex-col overflow-hidden">
                        <div className="space-y-1.5 shrink-0">
                            <label className="text-sm font-medium">Collection Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. One Piece - Spanish Editions"
                                className="w-full px-3 py-2 border rounded-md bg-background focus:ring-1 focus:ring-primary"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col overflow-hidden">
                            <label className="text-sm font-medium">Select Volumes</label>

                            {/* Search */}
                            <div className="relative shrink-0">
                                <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search library..."
                                    className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-secondary/50"
                                />
                            </div>

                            {/* Volume List */}
                            <div className="border rounded-md bg-muted/20 flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin">
                                {isLoadingVolumes ? (
                                    <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">Loading volumes...</div>
                                ) : filteredVolumes.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">No volumes found</div>
                                ) : (
                                    <>
                                        {/* Group 1: Available */}
                                        {available.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1 uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur py-1 z-10">Unassigned Volumes</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {available.map(vol => (
                                                        <VolumeItem
                                                            key={vol.id}
                                                            volume={vol}
                                                            isSelected={selectedIds.has(vol.id)}
                                                            onToggle={() => toggleSelection(vol.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Group 2: Already Collected */}
                                        {alreadyCollected.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 px-1 mt-4 sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
                                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Already in Collections</h4>
                                                    <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 rounded-full">Multi-collection</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {alreadyCollected.map(vol => (
                                                        <VolumeItem
                                                            key={vol.id}
                                                            volume={vol}
                                                            isSelected={selectedIds.has(vol.id)}
                                                            onToggle={() => toggleSelection(vol.id)}
                                                            badge="In Collection"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground text-right shrink-0">
                                {selectedIds.size} volumes selected
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-muted/10 flex justify-end gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isPending ? 'Creating...' : 'Create Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function VolumeItem({ volume, isSelected, onToggle, badge }: { volume: ExtendedVolume, isSelected: boolean, onToggle: () => void, badge?: string }) {
    return (
        <div
            onClick={onToggle}
            className={`group flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${isSelected
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'bg-card hover:bg-muted border-border'}`}
        >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                {isSelected && <Check size={12} />}
            </div>

            <div className="relative w-10 h-14 bg-muted rounded overflow-hidden shrink-0">
                {volume.manga_series?.cover_url && (
                    <Image src={volume.manga_series.cover_url} alt="" fill className="object-cover" sizes="40px" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{volume.manga_series?.title}</p>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Vol. {volume.volume_number}</p>
                    {badge && (
                        <span className="text-[9px] bg-secondary/80 px-1 rounded flex items-center gap-0.5 whitespace-nowrap">
                            <Library size={8} /> {badge}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
