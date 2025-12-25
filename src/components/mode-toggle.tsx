"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-[88px] h-[32px] rounded-full bg-secondary/50 border border-border/50" />
        )
    }

    return (
        <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "light"
                        ? "bg-background shadow-sm text-foreground scale-110"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Light Mode"
            >
                <Sun size={14} />
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "system"
                        ? "bg-background shadow-sm text-foreground scale-110"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="System Mode"
            >
                <Laptop size={14} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all duration-300 ${theme === "dark"
                        ? "bg-background shadow-sm text-foreground scale-110"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                title="Dark Mode"
            >
                <Moon size={14} />
            </button>
        </div>
    )
}
