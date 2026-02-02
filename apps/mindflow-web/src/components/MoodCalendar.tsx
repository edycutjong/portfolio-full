"use client";

import { moodEmojis } from "@/resources";
import { Column, Flex, Row, Text } from "@once-ui-system/core";

interface CalendarEntry {
    id: string;
    date: string;
    mood: number;
}

interface MoodCalendarProps {
    entries: CalendarEntry[];
}

export function MoodCalendar({ entries }: MoodCalendarProps) {
    // Generate days for current month (February 2026)
    const daysInMonth = 28;
    const firstDayOffset = 0; // February 2026 starts on Sunday
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Map entries to day numbers (simplified demo)
    const moodByDay: Record<number, number> = {
        2: 4,
        1: 3,
        31: 5,
        30: 2,
        29: 4,
        28: 3,
        27: 4,
        26: 5,
        25: 3,
    };

    const getMoodColor = (mood: number) => {
        const colors = {
            1: "var(--brand-solid-strong)",
            2: "var(--brand-solid-medium)",
            3: "var(--brand-alpha-medium)",
            4: "var(--accent-alpha-medium)",
            5: "var(--accent-solid-strong)",
        };
        return colors[mood as keyof typeof colors] || "var(--neutral-alpha-weak)";
    };

    return (
        <Column
            gap="16"
            padding="24"
            background="surface"
            radius="l"
            border="neutral-alpha-weak"
            fillWidth
        >
            <Text variant="heading-strong-m">February 2026</Text>

            {/* Week day headers */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                }}
            >
                {weekDays.map((day) => (
                    <Flex key={day} horizontal="center" padding="8">
                        <Text variant="label-default-xs" onBackground="neutral-weak">
                            {day}
                        </Text>
                    </Flex>
                ))}
            </div>

            {/* Calendar grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                }}
            >
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <Flex key={`empty-${i}`} />
                ))}

                {/* Day cells */}
                {days.map((day) => {
                    const mood = moodByDay[day];
                    const moodData = mood
                        ? moodEmojis.find((m) => m.value === mood)
                        : null;

                    return (
                        <Flex
                            key={day}
                            direction="column"
                            horizontal="center"
                            vertical="center"
                            padding="12"
                            radius="m"
                            gap="4"
                            style={{
                                background: mood
                                    ? getMoodColor(mood)
                                    : "var(--neutral-alpha-weak)",
                                cursor: mood ? "pointer" : "default",
                                minHeight: "72px",
                            }}
                            className="calendar-day"
                        >
                            <Text variant="label-default-s">{day}</Text>
                            {moodData && (
                                <Text style={{ fontSize: "1.25rem" }}>{moodData.emoji}</Text>
                            )}
                        </Flex>
                    );
                })}
            </div>

            {/* Legend */}
            <Row gap="16" horizontal="center" wrap>
                {moodEmojis.map((mood) => (
                    <Row key={mood.value} gap="4" vertical="center">
                        <Flex
                            style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "4px",
                                background: getMoodColor(mood.value),
                            }}
                        />
                        <Text variant="label-default-xs" onBackground="neutral-weak">
                            {mood.label}
                        </Text>
                    </Row>
                ))}
            </Row>
        </Column>
    );
}
