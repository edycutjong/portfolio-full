"use client";

import { moodEmojis } from "@/resources";
import {
    Column,
    Flex,
    Grid,
    Heading,
    Icon,
    RevealFx,
    Row,
    Text,
} from "@once-ui-system/core";

export default function InsightsPage() {
    // Demo data for insights
    const weeklyStats = {
        averageMood: 3.8,
        entriesCount: 7,
        longestStreak: 5,
        topEmotion: "Grateful",
    };

    const emotionBreakdown = [
        { emotion: "Grateful", count: 4, percentage: 40 },
        { emotion: "Productive", count: 3, percentage: 30 },
        { emotion: "Stressed", count: 2, percentage: 20 },
        { emotion: "Calm", count: 1, percentage: 10 },
    ];

    const aiInsights = [
        {
            title: "Pattern Detected",
            description:
                "Your mood tends to improve on days when you mention morning routines. Consider maintaining a consistent morning practice.",
            icon: "insights",
        },
        {
            title: "Positive Trigger",
            description:
                "Conversations with friends appear frequently in your positive entries. Social connection is clearly important to your wellbeing.",
            icon: "happy",
        },
        {
            title: "Stress Pattern",
            description:
                "Work-related stress peaks on Tuesdays. Consider scheduling lighter tasks or breaks on this day.",
            icon: "calendar",
        },
    ];

    const recommendations = [
        "Try a 5-minute meditation before starting work",
        "Schedule a coffee chat with a friend this week",
        "Write down 3 things you're grateful for tonight",
        "Take a 10-minute walk during lunch breaks",
    ];

    return (
        <Column gap="32" fillWidth>
            {/* Header */}
            <RevealFx translateY="8" delay={0}>
                <Column gap="8">
                    <Heading as="h1" variant="heading-strong-xl">
                        Your Insights
                    </Heading>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                        AI-powered analysis of your emotional patterns
                    </Text>
                </Column>
            </RevealFx>

            {/* Weekly Stats */}
            <RevealFx translateY="8" delay={0.1}>
                <Row gap="16" wrap horizontal="center">
                    <StatCard
                        label="Average Mood"
                        value={weeklyStats.averageMood.toFixed(1)}
                        icon="happy"
                        emoji={moodEmojis[Math.round(weeklyStats.averageMood) - 1]?.emoji}
                    />
                    <StatCard
                        label="Entries This Week"
                        value={weeklyStats.entriesCount.toString()}
                        icon="journal"
                    />
                    <StatCard
                        label="Current Streak"
                        value={`${weeklyStats.longestStreak} days`}
                        icon="calendar"
                    />
                    <StatCard
                        label="Top Emotion"
                        value={weeklyStats.topEmotion}
                        icon="insights"
                    />
                </Row>
            </RevealFx>

            {/* Emotion Breakdown */}
            <RevealFx translateY="8" delay={0.2}>
                <Column
                    gap="20"
                    padding="24"
                    background="surface"
                    radius="l"
                    border="neutral-alpha-weak"
                >
                    <Row gap="8" vertical="center">
                        <Icon name="analytics" size="m" />
                        <Heading as="h2" variant="heading-strong-m">
                            Emotion Breakdown
                        </Heading>
                    </Row>
                    <Column gap="12">
                        {emotionBreakdown.map((item, index) => (
                            <RevealFx key={item.emotion} translateY="4" delay={0.05 * index}>
                                <Row gap="12" vertical="center" fillWidth>
                                    <Text
                                        variant="label-default-s"
                                        style={{ minWidth: "100px" }}
                                    >
                                        {item.emotion}
                                    </Text>
                                    <Flex style={{ flex: 1, height: "24px" }}>
                                        <Flex
                                            style={{
                                                width: `${item.percentage}%`,
                                                height: "100%",
                                                background: `var(--brand-solid-strong)`,
                                                borderRadius: "4px",
                                                transition: "width 0.5s ease",
                                            }}
                                        />
                                    </Flex>
                                    <Text
                                        variant="label-default-s"
                                        onBackground="neutral-weak"
                                        style={{ minWidth: "50px", textAlign: "right" }}
                                    >
                                        {item.count} times
                                    </Text>
                                </Row>
                            </RevealFx>
                        ))}
                    </Column>
                </Column>
            </RevealFx>

            {/* AI Insights */}
            <RevealFx translateY="8" delay={0.3}>
                <Column gap="20">
                    <Row gap="8" vertical="center">
                        <Icon name="ai" size="m" />
                        <Heading as="h2" variant="heading-strong-m">
                            AI Insights
                        </Heading>
                    </Row>
                    <Column gap="12">
                        {aiInsights.map((insight, index) => (
                            <RevealFx key={insight.title} translateY="4" delay={0.05 * index}>
                                <Row
                                    gap="16"
                                    padding="20"
                                    background="surface"
                                    radius="l"
                                    border="neutral-alpha-weak"
                                    vertical="start"
                                >
                                    <Icon name={insight.icon} size="m" />
                                    <Column gap="4" style={{ flex: 1 }}>
                                        <Text variant="heading-strong-s">{insight.title}</Text>
                                        <Text variant="body-default-s" onBackground="neutral-weak">
                                            {insight.description}
                                        </Text>
                                    </Column>
                                </Row>
                            </RevealFx>
                        ))}
                    </Column>
                </Column>
            </RevealFx>

            {/* Recommendations */}
            <RevealFx translateY="8" delay={0.4}>
                <Column
                    gap="16"
                    padding="24"
                    background="brand-alpha-weak"
                    radius="l"
                    border="brand-alpha-medium"
                >
                    <Row gap="8" vertical="center">
                        <Icon name="insights" size="m" />
                        <Heading as="h2" variant="heading-strong-m">
                            Personalized Recommendations
                        </Heading>
                    </Row>
                    <Column as="ul" gap="8" style={{ paddingLeft: "24px" }}>
                        {recommendations.map((rec, index) => (
                            <Text key={`rec-${index}`} as="li" variant="body-default-m">
                                {rec}
                            </Text>
                        ))}
                    </Column>
                </Column>
            </RevealFx>
        </Column>
    );
}

function StatCard({
    label,
    value,
    icon,
    emoji,
}: {
    label: string;
    value: string;
    icon: string;
    emoji?: string;
}) {
    return (
        <Column
            gap="12"
            padding="20"
            background="surface"
            radius="l"
            border="neutral-alpha-weak"
            horizontal="center"
            align="center"
        >
            <Row gap="8" vertical="center">
                <Icon name={icon} size="s" />
                {emoji && <Text style={{ fontSize: "1.5rem" }}>{emoji}</Text>}
            </Row>
            <Text variant="display-strong-m">{value}</Text>
            <Text variant="label-default-xs" onBackground="neutral-weak">
                {label}
            </Text>
        </Column>
    );
}
