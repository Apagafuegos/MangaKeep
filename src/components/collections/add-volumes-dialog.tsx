'use client'

import { useState } from 'react'
import { Plus, Search, CheckSquare, X } from 'lucide-react'
import { UserVolume } from '@/types'
import { addVolumesToCollection } from '@/app/actions/inventory'
import { toast } from 'sonner'
import Image from 'next/image'

interface AddVolumesDialogProps {
    collectionId: string
    availableVolumes: UserVolume[]
}

export function AddVolumesDialog({ collectionId, availableVolumes }: AddVolumesDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isPending, setIsPending] = useState(false)

    const filteredVolumes = availableVolumes.filter(vol =>
        vol.manga_series?.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredVolumes.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredVolumes.map(v => v.id)))
        }
    }

    const handleAdd = async () => {
        if (selectedIds.size === 0) return

        setIsPending(true)
        try {
            await addVolumesToCollection(collectionId, Array.from(selectedIds))
            toast.success(`Added ${selectedIds.size} volumes`)
            setIsOpen(false)
            setSelectedIds(new Set())
        } catch {
            toast.error('Failed to add volumes')
        } finally {
            setIsPending(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Volumes</span>
                <span className="sm:hidden">Add</span>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full max-w-2xl rounded-2xl shadow-xl border overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-bold">Add Volumes to Collection</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Sub-header / Controls */}
                <div className="p-4 border-b bg-muted/30 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search available volumes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    {filteredVolumes.length > 0 && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={toggleSelectAll}
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
                            >
                                <CheckSquare size={14} />
                                {selectedIds.size === filteredVolumes.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <span className="text-xs text-muted-foreground">
                                {selectedIds.size} selected
                            </span>
                        </div>
                    )}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredVolumes.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            {searchQuery ? 'No matching volumes found.' : 'No available volumes to add.'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredVolumes.map((vol) => (
                                <div
                                    key={vol.id}
                                    onClick={() => toggleSelection(vol.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedIds.has(vol.id)
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-border/80 hover:bg-secondary/30'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.has(vol.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                                        }`}>
                                        {selectedIds.has(vol.id) && <CheckSquare size={12} />}
                                    </div>

                                    {/* Tiny Cover Preview */}
                                    <div className="w-10 h-14 bg-muted rounded overflow-hidden relative flex-shrink-0">
                                        {vol.manga_series?.cover_url ? (
                                            <Image
                                                src={vol.manga_series.cover_url}
                                                alt={vol.manga_series.title}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground bg-secondary">
                                                {vol.volume_number}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold truncate">{vol.manga_series?.title}</h3>
                                        <p className="text-xs text-muted-foreground">Vol. {vol.volume_number}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/30 flex justify-end gap-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium hover:underline text-muted-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={selectedIds.size === 0 || isPending}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isPending ? 'Adding...' : `Add ${selectedIds.size > 0 ? selectedIds.size : ''} Volumes`}
                    </button>
                </div>
            </div>
        </div>
    )
}
