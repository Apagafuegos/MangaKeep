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

    const cycleTheme = () => {
        if (theme === 'system') setTheme('light')
        else if (theme === 'light') setTheme('dark')
        else setTheme('system')
    }

    return (
        <>
            {/* Desktop View: All 3 buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
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

            {/* Mobile View: Single cycling button */}
            <button
                onClick={cycleTheme}
                className="flex sm:hidden p-2 rounded-full bg-secondary/50 border border-border/50 text-foreground hover:bg-secondary transition-all duration-300"
                title={`Current: ${theme} - Click to switch`}
            >
                {theme === 'light' && <Sun size={16} />}
                {theme === 'dark' && <Moon size={16} />}
                {theme === 'system' && <Laptop size={16} />}
            </button>
        </>
    )

}
