import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'DocuMind AI - Intelligent Document Q&A',
    description: 'Upload documents, ask questions, get instant cited answers using RAG technology.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[#0a0a0f]">{children}</body>
        </html>
    )
}
