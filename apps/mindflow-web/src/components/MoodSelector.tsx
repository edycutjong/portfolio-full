"use client";

import { moodEmojis } from "@/resources";
import { Flex, Row, Text } from "@once-ui-system/core";

interface MoodSelectorProps {
    selected: number | null;
    onSelect: (value: number) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
    return (
        <Row gap="16" horizontal="center" wrap>
            {moodEmojis.map((mood) => (
                <Flex
                    key={mood.value}
                    direction="column"
                    horizontal="center"
                    gap="8"
                    padding="16"
                    radius="m"
                    cursor="interactive"
                    background={selected === mood.value ? "brand-alpha-weak" : undefined}
                    border={selected === mood.value ? "brand-strong" : "neutral-alpha-weak"}
                    onClick={() => onSelect(mood.value)}
                    className="mood-button"
                    style={{
                        transform: selected === mood.value ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.2s ease",
                    }}
                >
                    <Text style={{ fontSize: "2rem" }}>{mood.emoji}</Text>
                    <Text variant="label-default-s" onBackground="neutral-weak">
                        {mood.label}
                    </Text>
                </Flex>
            ))}
        </Row>
    );
}
