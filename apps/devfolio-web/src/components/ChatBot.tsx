"use client";

import { useState, useRef, useEffect } from "react";
import {
    Button,
    Column,
    Flex,
    Heading,
    Input,
    Text,
} from "@once-ui-system/core";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "👋 Hi! I'm an AI assistant that knows everything about Edy. Ask me about skills, projects, or experience!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.edycu.dev";
            const res = await fetch(`${apiUrl}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, conversationId }),
            });

            const json = await res.json();

            if (json.success && json.data) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: json.data.response },
                ]);
                setConversationId(json.data.conversationId);
            } else {
                throw new Error("Invalid response");
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting. Please try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "What are your main skills?",
        "Tell me about your projects",
        "What's your experience with AI/ML?",
    ];

    return (
        <>
            {/* Floating chat button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="primary"
                size="l"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    zIndex: 1000,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                )}
            </Button>

            {/* Chat window */}
            {isOpen && (
                <Column
                    radius="l"
                    border="neutral-alpha-weak"
                    background="surface"
                    style={{
                        position: "fixed",
                        bottom: "96px",
                        right: "24px",
                        width: "380px",
                        maxWidth: "calc(100vw - 48px)",
                        height: "500px",
                        zIndex: 1000,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <Flex
                        paddingX="m"
                        paddingY="s"
                        borderBottom="neutral-alpha-weak"
                        background="neutral-weak"
                    >
                        <Column gap="2">
                            <Heading as="h3" variant="heading-strong-s">
                                AI Assistant
                            </Heading>
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                                Ask me anything about Edy
                            </Text>
                        </Column>
                    </Flex>

                    {/* Messages */}
                    <Column
                        flex={1}
                        gap="s"
                        padding="m"
                        style={{ overflowY: "auto" }}
                    >
                        {messages.map((msg, i) => (
                            <Flex
                                key={i}
                                style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                            >
                                <Flex
                                    paddingX="m"
                                    paddingY="s"
                                    radius="l"
                                    background={msg.role === "user" ? "brand-strong" : "neutral-weak"}
                                    style={{ maxWidth: "85%" }}
                                >
                                    <Text
                                        variant="body-default-s"
                                        onBackground={msg.role === "user" ? "brand-strong" : "neutral-strong"}
                                    >
                                        {msg.content}
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                        {isLoading && (
                            <Flex style={{ justifyContent: "flex-start" }}>
                                <Flex paddingX="m" paddingY="s" radius="l" background="neutral-weak">
                                    <Text variant="body-default-s" onBackground="neutral-weak">
                                        Thinking...
                                    </Text>
                                </Flex>
                            </Flex>
                        )}
                        <div ref={messagesEndRef} />
                    </Column>

                    {/* Suggested questions (only on first message) */}
                    {messages.length === 1 && (
                        <Flex paddingX="m" paddingBottom="s" gap="8" wrap>
                            {suggestedQuestions.map((q) => (
                                <Button
                                    key={q}
                                    variant="tertiary"
                                    size="s"
                                    onClick={() => setInput(q)}
                                >
                                    {q}
                                </Button>
                            ))}
                        </Flex>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit}>
                        <Flex
                            paddingX="m"
                            paddingY="s"
                            gap="8"
                            borderTop="neutral-alpha-weak"
                            style={{ alignItems: "center" }}
                        >
                            <Input
                                id="chat-input"
                                label=""
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                style={{ flex: 1 }}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="m"
                                disabled={isLoading || !input.trim()}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 19V5M5 12l7-7 7 7" />
                                </svg>
                            </Button>
                        </Flex>
                    </form>
                </Column>
            )}
        </>
    );
}
