'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
    theme: Theme
    resolvedTheme: 'dark' | 'light'
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        // Get saved theme from localStorage
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved) {
            setTheme(saved)
        }
    }, [])

    useEffect(() => {
        // Determine resolved theme
        let resolved: 'dark' | 'light' = 'dark'

        if (theme === 'system') {
            // Check system preference
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            resolved = theme
        }

        setResolvedTheme(resolved)

        // Apply to document
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(resolved)

        // Save to localStorage
        localStorage.setItem('theme', theme)
    }, [theme])

    // Listen for system preference changes
    useEffect(() => {
        if (theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            setResolvedTheme(e.matches ? 'dark' : 'light')
            document.documentElement.classList.remove('dark', 'light')
            document.documentElement.classList.add(e.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
