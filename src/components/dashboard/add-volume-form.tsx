'use client'

import { addVolume, getCollections } from '@/app/actions/inventory'
import { lookupISBN } from '@/app/actions/lookup'
import { BarcodeScanner } from '@/components/scanner/barcode-scanner'
import { Camera, Loader2, Plus, X, Library } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Collection } from '@/types'

export function AddVolumeForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [isLookingUp, setIsLookingUp] = useState(false)

    // Collection State
    const [collections, setCollections] = useState<Collection[]>([])
    const [isCreatingCollection, setIsCreatingCollection] = useState(false)

    // Controlled inputs to allow auto-fill
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [isbn, setIsbn] = useState('')
    const [volumeNumber, setVolumeNumber] = useState('')

    const formRef = useRef<HTMLFormElement>(null)

    // Fetch collections when opening modal
    useEffect(() => {
        if (isOpen) {
            getCollections().then(data => {
                if (data) setCollections(data as unknown as Collection[])
            })
        }
    }, [isOpen])

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true)
        try {
            await addVolume(formData)
            toast.success('Volume added successfully')
            resetForm()
            setIsOpen(false)
        } catch (error) {
            toast.error('Failed to add volume')
        } finally {
            setIsPending(false)
        }
    }

    const resetForm = () => {
        setTitle('')
        setAuthor('')
        setIsbn('')
        setVolumeNumber('')
        setShowScanner(false)
        setIsCreatingCollection(false)
        formRef.current?.reset()
    }

    const handleScan = async (code: string) => {
        setShowScanner(false)
        setIsbn(code)
        toast.info(`Scanned: ${code}`)
        await handleLookup(code)
    }

    const handleLookup = async (code: string) => {
        if (!code || code.length < 10) return

        setIsLookingUp(true)
        try {
            const info = await lookupISBN(code)
            if (info) {
                setTitle(info.title)
                setAuthor(info.author)

                // Try to infer volume number
                const volMatch = info.title.match(/Vol\.?\s*(\d+)/i) || info.title.match(/Volume\s*(\d+)/i) || info.title.match(/\s(\d+)$/)
                if (volMatch) {
                    setVolumeNumber(volMatch[1])
                }
                toast.success('Found book info')
            } else {
                toast.error('No book found for this ISBN')
            }
        } catch (error) {
            console.error("Lookup failed", error)
        } finally {
            setIsLookingUp(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                type="button"
            >
                <Plus size={18} />
                Add Volume
            </button>
        )
    }

    return (
        <div className="bg-card border rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-top-2 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Add New Volume</h3>

                <button
                    type="button"
                    onClick={() => setShowScanner(!showScanner)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${showScanner
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                        }`}
                >
                    {showScanner ? <X size={14} /> : <Camera size={14} />}
                    {showScanner ? 'Close Scanner' : 'Scan'}
                </button>
            </div>

            {showScanner && (
                <div className="mb-4">
                    <BarcodeScanner onScanSuccess={handleScan} />
                </div>
            )}

            <form
                ref={formRef}
                action={handleSubmit}
                className="grid gap-4"
            >
                {/* ISBN Field */}
                <div className="space-y-1 relative">
                    <label className="text-xs font-medium text-muted-foreground w-full flex justify-between">
                        <span>ISBN (Optional)</span>
                        {isLookingUp && <span className="text-primary animate-pulse">Searching...</span>}
                    </label>
                    <div className="flex gap-2">
                        <input
                            name="isbn"
                            value={isbn}
                            onChange={(e) => setIsbn(e.target.value)}
                            onBlur={(e) => handleLookup(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm bg-background"
                            placeholder="978..."
                        />
                        <button
                            type="button"
                            onClick={() => handleLookup(isbn)}
                            disabled={isLookingUp}
                            className="px-3 py-2 bg-secondary text-secondary-foreground rounded border hover:bg-secondary/80"
                        >
                            {isLookingUp ? <Loader2 size={16} className="animate-spin" /> : 'Go'}
                        </button>
                    </div>
                </div>

                {/* Collection Selector */}
                <div className="space-y-1 p-3 bg-muted/30 rounded border border-dashed">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Library size={12} />
                            Collection (Optional)
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsCreatingCollection(!isCreatingCollection)}
                            className="text-[10px] text-primary hover:underline"
                        >
                            {isCreatingCollection ? 'Select Existing' : 'Create New'}
                        </button>
                    </div>

                    {isCreatingCollection ? (
                        <input
                            name="new_collection_name"
                            className="w-full border rounded px-3 py-2 text-sm bg-background"
                            placeholder="e.g. One Piece - Spanish"
                            autoFocus
                        />
                    ) : (
                        <select name="collection_id" className="w-full border rounded px-3 py-2 text-sm bg-background">
                            <option value="">No Collection</option>
                            {collections.length > 0 && <hr />}
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.volume_count?.toString() || 0} items)
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                        <input
                            name="title"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm bg-background"
                            placeholder="e.g. Naruto"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Author</label>
                        <input
                            name="author"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm bg-background"
                            placeholder="Masashi Kishimoto"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Vol #</label>
                        <input
                            name="volume_number"
                            required
                            value={volumeNumber}
                            onChange={e => setVolumeNumber(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm bg-background"
                            placeholder="1"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Edition</label>
                        <select name="edition_type" className="w-full border rounded px-3 py-2 text-sm bg-background">
                            <option value="Standard">Standard</option>
                            <option value="Omnibus">Omnibus</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Digital">Digital</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Lang</label>
                        <input name="language" defaultValue="en" className="w-full border rounded px-3 py-2 text-sm bg-background" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); resetForm(); }}
                        disabled={isPending}
                        className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                        {isPending ? 'Adding...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}
