"use client";

import { useState } from "react";
import { moodEmojis } from "@/resources";
import {
    Button,
    Column,
    Heading,
    Icon,
    Input,
    RevealFx,
    Row,
    Text,
    Textarea,
} from "@once-ui-system/core";
import Link from "next/link";
import { MoodSelector } from "@/components/MoodSelector";

export default function NewJournalPage() {
    const [mood, setMood] = useState<number | null>(null);
    const [content, setContent] = useState("");
    const [aiPrompt, setAiPrompt] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const aiPrompts = [
        "What specific moments today made you feel this way?",
        "Is there anything you're grateful for right now?",
        "What would make tomorrow even better?",
        "How does this feeling connect to your goals?",
        "What self-care activity might help you right now?",
    ];

    const handleContentChange = (value: string) => {
        setContent(value);

        // Simulate AI prompt after typing
        if (value.length > 50 && !aiPrompt) {
            const randomPrompt = aiPrompts[Math.floor(Math.random() * aiPrompts.length)];
            setAiPrompt(randomPrompt);
        }
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <Column gap="32" fillWidth>
            {/* Header */}
            <RevealFx translateY="8" delay={0}>
                <Row horizontal="between" vertical="center" fillWidth>
                    <Row gap="12" vertical="center">
                        <Link href="/journal">
                            <Button variant="tertiary" prefixIcon="arrowLeft">
                                Back
                            </Button>
                        </Link>
                        <Heading as="h1" variant="heading-strong-xl">
                            New Entry
                        </Heading>
                    </Row>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </Row>
            </RevealFx>

            {/* Mood Selection */}
            <RevealFx translateY="8" delay={0.1}>
                <Column
                    gap="16"
                    padding="24"
                    background="surface"
                    radius="l"
                    border="neutral-alpha-weak"
                >
                    <Row gap="8" vertical="center">
                        <Icon name="happy" size="m" />
                        <Text variant="heading-strong-s">How are you feeling?</Text>
                    </Row>
                    <MoodSelector selected={mood} onSelect={setMood} />
                </Column>
            </RevealFx>

            {/* Journal Content */}
            <RevealFx translateY="8" delay={0.2}>
                <Column
                    gap="16"
                    padding="24"
                    background="surface"
                    radius="l"
                    border="neutral-alpha-weak"
                >
                    <Row gap="8" vertical="center">
                        <Icon name="journal" size="m" />
                        <Text variant="heading-strong-s">Write your thoughts</Text>
                    </Row>
                    <Textarea
                        id="journal-content"
                        placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
                        value={content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        style={{ minHeight: "200px" }}
                    />

                    {/* AI Prompt */}
                    {aiPrompt && (
                        <RevealFx translateY="4" delay={0}>
                            <Row
                                gap="12"
                                padding="16"
                                background="brand-alpha-weak"
                                radius="m"
                                vertical="center"
                            >
                                <Icon name="ai" size="s" />
                                <Column gap="4" style={{ flex: 1 }}>
                                    <Text variant="label-default-xs" onBackground="brand-weak">
                                        AI Suggestion
                                    </Text>
                                    <Text variant="body-default-s">{aiPrompt}</Text>
                                </Column>
                            </Row>
                        </RevealFx>
                    )}

                    {/* Sentiment Indicator */}
                    {content.length > 20 && (
                        <Row gap="8" vertical="center">
                            <Text variant="label-default-xs" onBackground="neutral-weak">
                                Detected sentiment:
                            </Text>
                            <Text
                                variant="label-default-s"
                                style={{
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    background: "var(--brand-alpha-weak)",
                                }}
                            >
                                {content.includes("great") || content.includes("happy") || content.includes("good")
                                    ? "Positive 😊"
                                    : content.includes("sad") || content.includes("difficult") || content.includes("stressed")
                                        ? "Needs attention 💙"
                                        : "Neutral 😐"}
                            </Text>
                        </Row>
                    )}
                </Column>
            </RevealFx>

            {/* Actions */}
            <RevealFx translateY="8" delay={0.3}>
                <Row gap="12" horizontal="end">
                    <Button variant="secondary" onClick={handleAnalyze} prefixIcon="ai">
                        {isAnalyzing ? "Analyzing..." : "Get AI Insights"}
                    </Button>
                    <Button variant="primary" disabled={!mood || content.length < 10}>
                        Save Entry
                    </Button>
                </Row>
            </RevealFx>
        </Column>
    );
}
