'use client'

import { UserVolume, ReadingStatus } from '@/types'
import { CheckCircle2, Circle, MoreVertical, Trash2, BookOpen, Library, LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { deleteVolume, updateStatus } from '@/app/actions/inventory'
import { useState } from 'react'
import { toast } from 'sonner'

interface VolumeCardProps {
    volume: UserVolume
    isSelectMode?: boolean
    isSelected?: boolean
    onToggleSelect?: () => void
}

const statusConfig: Record<ReadingStatus, { icon: LucideIcon, color: string, label: string }> = {
    unread: { icon: Circle, color: 'bg-black/40 text-white', label: 'Unread' },
    reading: { icon: BookOpen, color: 'bg-blue-500 text-white', label: 'Reading' },
    completed: { icon: CheckCircle2, color: 'bg-green-500 text-white', label: 'Completed' },
    collected: { icon: Library, color: 'bg-purple-500 text-white', label: 'Collected' },
}

export function VolumeCard({ volume, isSelectMode, isSelected, onToggleSelect }: VolumeCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this volume?')) {
            setIsDeleting(true)
            try {
                await deleteVolume(volume.id)
                toast.success('Volume deleted')
            } catch {
                toast.error('Failed to delete')
                setIsDeleting(false)
            }
        }
    }

    const handleStatusChange = async (newStatus: ReadingStatus) => {
        try {
            await updateStatus(volume.id, newStatus)
            setIsStatusOpen(false)
            toast.success(`Marked as ${newStatus}`)
        } catch {
            toast.error('Failed to update status')
        }
    }

    const handleCardClick = () => {
        if (isSelectMode && onToggleSelect) {
            onToggleSelect()
        }
    }

    const currentStatus = statusConfig[volume.status] || statusConfig.unread

    return (
        <div
            onClick={handleCardClick}
            className={`group relative flex flex-col bg-card border rounded-lg overflow-hidden shadow-sm transition-all cursor-pointer 
            ${isSelectMode ? 'hover:ring-2 hover:ring-primary ring-offset-2' : 'hover:shadow-md'} 
            ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        >
            {/* Cover Image Area */}
            <div className="relative aspect-[2/3] w-full bg-muted">
                {volume.manga_series?.cover_url ? (
                    <Image
                        src={volume.manga_series.cover_url}
                        alt={volume.manga_series.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-medium p-4 text-center">
                        {volume.manga_series?.title}
                    </div>
                )}

                {/* Selection Checkbox Overlay */}
                {isSelectMode && (
                    <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-white/50 border-white'}`}>
                            {isSelected && <CheckCircle2 size={20} />}
                        </div>
                    </div>
                )}

                {/* Status Badge - Top Left (Hide in Select Mode) */}
                {!isSelectMode && (
                    <div className="absolute top-2 left-2 z-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsStatusOpen(!isStatusOpen) }}
                            className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-colors shadow-sm ${currentStatus.color}`}
                            title={currentStatus.label}
                        >
                            <currentStatus.icon size={16} />
                        </button>

                        {isStatusOpen && (
                            <div className="absolute left-0 top-full mt-2 w-36 bg-popover border rounded-lg shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                {(Object.keys(statusConfig) as ReadingStatus[]).map((status) => {
                                    const config = statusConfig[status]
                                    return (
                                        <button
                                            key={status}
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(status) }}
                                            className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors ${volume.status === status ? 'bg-muted/50 font-medium' : ''}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${status === volume.status ? 'bg-primary' : 'bg-transparent'}`} />
                                            <config.icon size={14} className="text-muted-foreground" />
                                            <span className="capitalize">{status}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Close status menu overlay */}
                        {isStatusOpen && (
                            <div
                                className="fixed inset-0 z-[-1]"
                                onClick={(e) => { e.stopPropagation(); setIsStatusOpen(false) }}
                            />
                        )}
                    </div>
                )}

                {/* Menu Button - Top Right (Hide in Select Mode) */}
                {!isSelectMode && (
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen) }}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
                        >
                            <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border rounded shadow-lg z-10 py-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete() }}
                                    disabled={isDeleting}
                                    className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted"
                                >
                                    <Trash2 size={14} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* Overlay to close menu when clicking outside */}
                        {isMenuOpen && (
                            <div
                                className="fixed inset-0 z-[-1]"
                                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false) }}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Info Area */}
            <div className="p-3 flex flex-col gap-1">
                <h3 className="font-semibold text-sm line-clamp-1" title={volume.manga_series?.title}>
                    {volume.manga_series?.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground volume-info">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Vol. {volume.volume_number}</span>
                    </div>
                    <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] uppercase">
                        {volume.edition_type}
                    </span>
                </div>
            </div>
        </div>
    )
}
