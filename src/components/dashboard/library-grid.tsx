'use client'

import { UserVolume, ReadingStatus } from '@/types'
import { useState } from 'react'
import { VolumeCard } from './volume-card'
import { Search, Trash2, CheckCircle2, X, Circle, CheckSquare, BookOpen, Library } from 'lucide-react'
import { bulkDeleteVolumes, bulkUpdateStatus } from '@/app/actions/inventory'
import { toast } from 'sonner'

interface LibraryGridProps {
    initialVolumes: UserVolume[]
}

type FilterType = 'all' | ReadingStatus

export function LibraryGrid({ initialVolumes }: LibraryGridProps) {
    const [filterMode, setFilterMode] = useState<FilterType>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Selection State
    const [isSelectMode, setIsSelectMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isBulkPending, setIsBulkPending] = useState(false)

    const filteredVolumes = initialVolumes.filter(vol => {
        // 1. Text Search
        if (searchQuery) {
            const titleMatch = vol.manga_series?.title.toLowerCase().includes(searchQuery.toLowerCase())
            if (!titleMatch) return false
        }

        // 2. Status Filter
        if (filterMode !== 'all' && vol.status !== filterMode) return false

        return true
    })

    // Handlers
    const toggleSelection = (id: string) => {
        const next = new Set(selectedIds)
        if (next.has(id)) {
            next.delete(id)
        } else {
            next.add(id)
        }
        setSelectedIds(next)
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredVolumes.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredVolumes.map(v => v.id)))
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.size} volumes?`)) return
        setIsBulkPending(true)
        try {
            await bulkDeleteVolumes(Array.from(selectedIds))
            setSelectedIds(new Set())
            setIsSelectMode(false)
            toast.success('Volumes deleted')
        } catch (e) {
            toast.error('Bulk delete failed')
        } finally {
            setIsBulkPending(false)
        }
    }

    const handleBulkStatus = async (status: ReadingStatus) => {
        setIsBulkPending(true)
        try {
            await bulkUpdateStatus(Array.from(selectedIds), status)
            setSelectedIds(new Set())
            setIsSelectMode(false)
            toast.success(`Marked as ${status}`)
        } catch (e) {
            toast.error('Bulk update failed')
        } finally {
            setIsBulkPending(false)
        }
    }

    return (
        <div className="space-y-6 relative min-h-[500px]">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-card/50 p-4 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:w-72 group">
                        <div className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full border border-input bg-background/50 rounded-lg py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSelectMode(!isSelectMode)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-all flex items-center gap-2 ${isSelectMode
                                ? 'bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90'
                                : 'bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground border-border/50'
                                }`}
                        >
                            {isSelectMode ? <X size={16} /> : <CheckSquare size={16} />}
                            {isSelectMode ? 'Done' : 'Select'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Filters */}
                {!isSelectMode && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {(['all', 'unread', 'reading', 'completed', 'collected'] as FilterType[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setFilterMode(mode)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all capitalize ${filterMode === mode
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                    : 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border-transparent hover:border-border'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Select All Toggle (Only in Select Mode) */}
            {isSelectMode && (
                <div className="flex items-center justify-between px-2 animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={toggleSelectAll}
                        className="text-sm text-primary font-medium hover:underline flex items-center gap-2"
                    >
                        <CheckSquare size={14} />
                        {selectedIds.size === filteredVolumes.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className="text-sm font-medium bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                        {selectedIds.size} selected
                    </span>
                </div>
            )}

            {/* Grid */}
            {filteredVolumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/60">
                    <div className="bg-muted/20 p-4 rounded-full mb-4">
                        <Search size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium">No volumes found.</p>
                    <p className="text-sm opacity-60">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredVolumes.map(vol => (
                        <div key={vol.id} className="animate-in fade-in zoom-in-95 duration-300">
                            <VolumeCard
                                volume={vol}
                                isSelectMode={isSelectMode}
                                isSelected={selectedIds.has(vol.id)}
                                onToggleSelect={() => toggleSelection(vol.id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Bar */}
            {isSelectMode && selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-foreground/95 backdrop-blur-md text-background p-2 rounded-full shadow-2xl border border-white/10 animate-in slide-in-from-bottom-8 fade-in duration-300">
                    <button
                        disabled={isBulkPending}
                        onClick={() => handleBulkStatus('unread')}
                        className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group"
                        title="Mark Unread"
                    >
                        <Circle size={20} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Unread</span>
                    </button>
                    <button
                        disabled={isBulkPending}
                        onClick={() => handleBulkStatus('reading')}
                        className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group"
                        title="Mark Reading"
                    >
                        <BookOpen size={20} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Reading</span>
                    </button>
                    <button
                        disabled={isBulkPending}
                        onClick={() => handleBulkStatus('completed')}
                        className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group"
                        title="Mark Completed"
                    >
                        <CheckCircle2 size={20} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Completed</span>
                    </button>
                    <button
                        disabled={isBulkPending}
                        onClick={() => handleBulkStatus('collected')}
                        className="p-2.5 hover:bg-white/20 rounded-full transition-colors relative group"
                        title="Mark Collected"
                    >
                        <Library size={20} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Collected</span>
                    </button>
                    <div className="w-px h-6 bg-background/20 mx-1"></div>
                    <button
                        disabled={isBulkPending}
                        onClick={handleBulkDelete}
                        className="p-2.5 hover:bg-red-500/90 rounded-full text-red-300 hover:text-white transition-colors relative group"
                        title="Delete"
                    >
                        <Trash2 size={20} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Delete</span>
                    </button>
                </div>
            )}
        </div>
    )
}
