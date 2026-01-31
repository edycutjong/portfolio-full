'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme()

    const cycleTheme = () => {
        if (theme === 'system') {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        } else if (theme === 'dark') {
            setTheme('light')
        } else {
            setTheme('system')
        }
    }

    return (
        <button
            onClick={cycleTheme}
            className="p-2 glass rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label={`Current theme: ${theme}. Click to switch.`}
            title={theme === 'system' ? 'System theme' : theme === 'dark' ? 'Dark theme' : 'Light theme'}
        >
            {resolvedTheme === 'dark' ? (
                // Moon icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
            ) : (
                // Sun icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            )}
            {theme === 'system' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
        </button>
    )
}
