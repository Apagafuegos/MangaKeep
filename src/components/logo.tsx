'use client'

import Image from 'next/image'

export function Logo() {
    return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 relative flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
            <Image
                src="/icon.png"
                alt="MangaKeep Logo"
                fill
                className="object-contain rounded-md"
                sizes="(max-width: 640px) 28px, 32px"
            />
        </div>
    )
}
