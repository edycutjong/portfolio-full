"use client";

import { moodEmojis } from "@/resources";
import { Column, Row, Text } from "@once-ui-system/core";
import Link from "next/link";

interface JournalEntry {
    id: string;
    date: string;
    mood: number;
    preview: string;
    sentiment: string;
}

interface JournalPreviewProps {
    entry: JournalEntry;
}

export function JournalPreview({ entry }: JournalPreviewProps) {
    const moodData = moodEmojis.find((m) => m.value === entry.mood);

    return (
        <Link href={`/journal/${entry.id}`} style={{ textDecoration: "none" }}>
            <Row
                fillWidth
                padding="20"
                background="surface"
                radius="l"
                border="neutral-alpha-weak"
                gap="16"
                vertical="center"
                className="journal-card"
                style={{ cursor: "pointer" }}
            >
                <Text style={{ fontSize: "1.75rem" }}>{moodData?.emoji || "😐"}</Text>
                <Column gap="4" style={{ flex: 1 }}>
                    <Row gap="8" vertical="center">
                        <Text variant="heading-strong-s">{entry.date}</Text>
                        <Text
                            variant="label-default-xs"
                            onBackground="brand-weak"
                            style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: "var(--brand-alpha-weak)",
                            }}
                        >
                            {entry.sentiment}
                        </Text>
                    </Row>
                    <Text
                        variant="body-default-s"
                        onBackground="neutral-weak"
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {entry.preview}
                    </Text>
                </Column>
            </Row>
        </Link>
    );
}
