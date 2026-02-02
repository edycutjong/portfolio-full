"use client";

import { useState } from "react";
import { app, moodEmojis } from "@/resources";
import {
    Button,
    Column,
    Flex,
    Heading,
    Icon,
    RevealFx,
    Row,
    Text,
} from "@once-ui-system/core";
import Link from "next/link";
import { MoodSelector } from "@/components/MoodSelector";
import { JournalPreview } from "@/components/JournalPreview";

export default function Home() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    // Demo data for recent entries
    const recentEntries = [
        {
            id: "1",
            date: "Today",
            mood: 4,
            preview: "Had a productive day working on the new project...",
            sentiment: "positive",
        },
        {
            id: "2",
            date: "Yesterday",
            mood: 3,
            preview: "Felt a bit overwhelmed with meetings but managed...",
            sentiment: "neutral",
        },
        {
            id: "3",
            date: "2 days ago",
            mood: 5,
            preview: "Amazing day! Got promoted and celebrated with friends...",
            sentiment: "very positive",
        },
    ];

    return (
        <Column gap="48" fillWidth>
            {/* Hero Section */}
            <RevealFx translateY="8" delay={0}>
                <Column gap="24" horizontal="center" align="center">
                    <Heading as="h1" variant="display-strong-l" align="center">
                        {app.tagline}
                    </Heading>
                    <Text
                        variant="body-default-l"
                        onBackground="neutral-weak"
                        align="center"
                        style={{ maxWidth: "600px" }}
                    >
                        {app.description}
                    </Text>
                </Column>
            </RevealFx>

            {/* Quick Mood Check-in */}
            <RevealFx translateY="8" delay={0.1}>
                <Column
                    gap="20"
                    padding="32"
                    background="surface"
                    radius="l"
                    border="neutral-alpha-weak"
                    horizontal="center"
                >
                    <Row gap="8" vertical="center">
                        <Icon name="ai" size="m" />
                        <Heading as="h2" variant="heading-strong-m">
                            How are you feeling right now?
                        </Heading>
                    </Row>
                    <MoodSelector
                        selected={selectedMood}
                        onSelect={setSelectedMood}
                    />
                    {selectedMood && (
                        <RevealFx translateY="4" delay={0}>
                            <Link href="/journal/new">
                                <Button variant="primary" size="l">
                                    Start Journaling
                                </Button>
                            </Link>
                        </RevealFx>
                    )}
                </Column>
            </RevealFx>

            {/* Recent Entries */}
            <RevealFx translateY="8" delay={0.2}>
                <Column gap="20">
                    <Row horizontal="between" vertical="center">
                        <Heading as="h2" variant="heading-strong-m">
                            Recent Entries
                        </Heading>
                        <Link href="/journal">
                            <Button variant="tertiary" suffixIcon="arrowRight">
                                View All
                            </Button>
                        </Link>
                    </Row>
                    <Column gap="12">
                        {recentEntries.map((entry, index) => (
                            <RevealFx key={entry.id} translateY="4" delay={0.1 * index}>
                                <JournalPreview entry={entry} />
                            </RevealFx>
                        ))}
                    </Column>
                </Column>
            </RevealFx>

            {/* Features Highlight */}
            <RevealFx translateY="8" delay={0.3}>
                <Row gap="16" wrap horizontal="center">
                    <FeatureCard
                        icon="ai"
                        title="AI Insights"
                        description="Get personalized insights and pattern recognition"
                    />
                    <FeatureCard
                        icon="calendar"
                        title="Mood Calendar"
                        description="Visualize your emotional journey over time"
                    />
                    <FeatureCard
                        icon="insights"
                        title="Weekly Reports"
                        description="Receive AI-generated summaries and recommendations"
                    />
                </Row>
            </RevealFx>
        </Column>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <Column
            gap="12"
            padding="24"
            background="surface"
            radius="l"
            border="neutral-alpha-weak"
            style={{ flex: "1 1 280px", maxWidth: "360px" }}
        >
            <Icon name={icon} size="l" />
            <Heading as="h3" variant="heading-strong-s">
                {title}
            </Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">
                {description}
            </Text>
        </Column>
    );
}
