"use client";

import { useState } from "react";
import { moodEmojis } from "@/resources";
import {
    Button,
    Column,
    Heading,
    Icon,
    RevealFx,
    Row,
    Text,
} from "@once-ui-system/core";
import Link from "next/link";
import { JournalPreview } from "@/components/JournalPreview";
import { MoodCalendar } from "@/components/MoodCalendar";

// Demo data
const journalEntries = [
    {
        id: "1",
        date: "February 2, 2026",
        mood: 4,
        preview: "Had a productive day working on the new AI project. Made great progress on the sentiment analysis feature...",
        sentiment: "positive",
    },
    {
        id: "2",
        date: "February 1, 2026",
        mood: 3,
        preview: "Felt a bit overwhelmed with meetings but managed to stay focused. Need to work on better boundaries...",
        sentiment: "neutral",
    },
    {
        id: "3",
        date: "January 31, 2026",
        mood: 5,
        preview: "Amazing day! Got promoted and celebrated with friends. Feeling grateful for all the support...",
        sentiment: "very positive",
    },
    {
        id: "4",
        date: "January 30, 2026",
        mood: 2,
        preview: "Difficult day. Struggled with a challenging bug that took hours to resolve. Feeling drained...",
        sentiment: "negative",
    },
    {
        id: "5",
        date: "January 29, 2026",
        mood: 4,
        preview: "Good morning routine today. Meditation helped clear my mind before diving into work...",
        sentiment: "positive",
    },
];

export default function JournalPage() {
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    return (
        <Column gap="32" fillWidth>
            {/* Header */}
            <RevealFx translateY="8" delay={0}>
                <Row horizontal="between" vertical="center" fillWidth>
                    <Column gap="8">
                        <Heading as="h1" variant="heading-strong-xl">
                            Your Journal
                        </Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            {journalEntries.length} entries this month
                        </Text>
                    </Column>
                    <Row gap="12">
                        <Button
                            variant={viewMode === "list" ? "primary" : "secondary"}
                            onClick={() => setViewMode("list")}
                            prefixIcon="journal"
                        >
                            List
                        </Button>
                        <Button
                            variant={viewMode === "calendar" ? "primary" : "secondary"}
                            onClick={() => setViewMode("calendar")}
                            prefixIcon="calendar"
                        >
                            Calendar
                        </Button>
                        <Link href="/journal/new">
                            <Button variant="primary" prefixIcon="add">
                                New Entry
                            </Button>
                        </Link>
                    </Row>
                </Row>
            </RevealFx>

            {/* Content */}
            {viewMode === "list" ? (
                <Column gap="12">
                    {journalEntries.map((entry, index) => (
                        <RevealFx key={entry.id} translateY="4" delay={0.05 * index}>
                            <JournalPreview entry={entry} />
                        </RevealFx>
                    ))}
                </Column>
            ) : (
                <RevealFx translateY="8" delay={0.1}>
                    <MoodCalendar entries={journalEntries} />
                </RevealFx>
            )}
        </Column>
    );
}
