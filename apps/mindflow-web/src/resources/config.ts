import { Geist, Geist_Mono } from "next/font/google";

// Base URL for SEO
export const baseURL = "https://mindflow.edycu.dev";

// Font configuration
const heading = Geist({
    variable: "--font-heading",
    subsets: ["latin"],
    display: "swap",
});

const body = Geist({
    variable: "--font-body",
    subsets: ["latin"],
    display: "swap",
});

const label = Geist({
    variable: "--font-label",
    subsets: ["latin"],
    display: "swap",
});

const code = Geist_Mono({
    variable: "--font-code",
    subsets: ["latin"],
    display: "swap",
});

export const fonts = {
    heading,
    body,
    label,
    code,
};

// Style configuration - calming blue/indigo theme for mental wellness
export const style = {
    theme: "system" as const,
    neutral: "gray" as const,
    brand: "indigo" as const,
    accent: "violet" as const,
    solid: "contrast" as const,
    solidStyle: "flat" as const,
    border: "playful" as const,
    surface: "translucent" as const,
    transition: "all" as const,
    scaling: "100" as const,
};

// Data visualization style
export const dataStyle = {
    variant: "gradient" as const,
    mode: "categorical" as const,
    height: 24,
    axis: {
        stroke: "var(--neutral-alpha-weak)",
    },
    tick: {
        fill: "var(--neutral-on-background-weak)",
        fontSize: 11,
        line: false,
    },
};

// Background effects
export const effects = {
    mask: {
        cursor: false,
        x: 50,
        y: 0,
        radius: 100,
    },
    gradient: {
        display: true,
        opacity: 60,
        x: 50,
        y: 0,
        width: 80,
        height: 60,
        tilt: 0,
        colorStart: "brand-background-strong",
        colorEnd: "page-background",
    },
    dots: {
        display: true,
        opacity: 20,
        size: "2",
        color: "brand-background-strong",
    },
    grid: {
        display: false,
        opacity: 100,
        color: "neutral-alpha-medium",
        width: "0.25rem",
        height: "0.25rem",
    },
    lines: {
        display: false,
        opacity: 100,
        color: "neutral-alpha-weak",
        size: "16",
        thickness: 1,
        angle: 45,
    },
};

// Mood emojis and their values
export const moodEmojis = [
    { value: 1, emoji: "😢", label: "Very Sad", color: "#6366f1" },
    { value: 2, emoji: "😔", label: "Sad", color: "#818cf8" },
    { value: 3, emoji: "😐", label: "Neutral", color: "#a5b4fc" },
    { value: 4, emoji: "🙂", label: "Good", color: "#c4b5fd" },
    { value: 5, emoji: "😄", label: "Great", color: "#ddd6fe" },
];

// App content
export const app = {
    name: "Mindflow",
    tagline: "Your AI-powered mood journal",
    description: "Track your emotions, discover patterns, and gain insights with AI-powered journaling.",
};
