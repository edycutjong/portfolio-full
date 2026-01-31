import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const siteUrl = 'https://edycu.dev'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Edy Cu | Full-Stack Developer',
    template: '%s | Edy Cu',
  },
  description:
    'Full-Stack Developer specializing in AI/ML, TypeScript, Go, Python, and cloud-native applications. Building high-performance systems and beautiful user experiences.',
  keywords: [
    'Edy Cu',
    'Full-Stack Developer',
    'Software Engineer',
    'AI Engineer',
    'TypeScript',
    'Go',
    'Python',
    'Rust',
    'Next.js',
    'React',
    'Remote Developer',
    'Cloud Architecture',
    'Machine Learning',
  ],
  authors: [{ name: 'Edy Cu', url: siteUrl }],
  creator: 'Edy Cu',
  publisher: 'Edy Cu',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Edy Cu - Portfolio',
    title: 'Edy Cu | Full-Stack Developer',
    description: 'AI-powered developer portfolio with interactive chatbot. Expertise in TypeScript, Go, Python, and modern cloud architecture.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Edy Cu - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edy Cu | Full-Stack Developer',
    description: 'AI-powered developer portfolio. Building high-performance systems with TypeScript, Go, Python.',
    site: '@edycutjong',
    creator: '@edycutjong',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Edy Cu',
  url: siteUrl,
  jobTitle: 'Full-Stack Developer',
  description: 'Full-Stack Developer specializing in AI/ML, high-performance systems, and cloud-native applications.',
  sameAs: [
    'https://github.com/edycutjong',
    'https://linkedin.com/in/edy-cu-tjong',
    'https://x.com/edycutjong',
  ],
  knowsAbout: [
    'TypeScript',
    'Python',
    'Go',
    'Rust',
    'React',
    'Next.js',
    'Machine Learning',
    'Cloud Architecture',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="gradient-bg min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
