/**
 * Shared utility functions for PortfolioFull projects
 */

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
}

export function truncate(text: string, length: number): string {
    if (text.length <= length) return text
    return `${text.slice(0, length)}...`
}
