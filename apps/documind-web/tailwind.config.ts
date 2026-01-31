import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                },
                accent: {
                    400: '#f472b6',
                    500: '#ec4899',
                },
            },
        },
    },
    plugins: [],
}
export default config
