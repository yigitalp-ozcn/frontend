"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <>
                <Sun className="h-4 w-4" />
                <span>Theme</span>
            </>
        )
    }

    const isDark = theme === "dark"

    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                setTheme(isDark ? "light" : "dark")
            }}
            className="contents"
        >
            {isDark ? (
                <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                </>
            )}
        </div>
    )
}