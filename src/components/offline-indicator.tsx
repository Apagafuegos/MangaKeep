'use client'

import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(false)

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false)
            toast.success('Back online!')
        }
        const handleOffline = () => {
            setIsOffline(true)
            toast.error('You are offline. Changes will not be saved.')
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Initial check
        setIsOffline(!navigator.onLine)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!isOffline) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in">
            <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-sm">
                <WifiOff size={16} />
                Offline Mode
            </div>
        </div>
    )
}
