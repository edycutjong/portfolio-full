import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevFolio | Full-Stack Developer Portfolio',
  description:
    'AI-powered developer portfolio showcasing expertise in TypeScript, Go, Python, and modern cloud architecture.',
  keywords: ['developer', 'portfolio', 'full-stack', 'ai', 'typescript', 'go', 'python'],
  authors: [{ name: 'Developer' }],
  openGraph: {
    title: 'DevFolio | Full-Stack Developer Portfolio',
    description: 'AI-powered developer portfolio with interactive chatbot',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="gradient-bg min-h-screen">{children}</body>
    </html>
  )
}
