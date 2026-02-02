"use client";

import { app } from "@/resources";
import {
    Column,
    Flex,
    Heading,
    Icon,
    Row,
    ToggleButton,
    useTheme,
} from "@once-ui-system/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <Row
            as="header"
            fillWidth
            horizontal="center"
            paddingX="24"
            paddingY="12"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid var(--neutral-alpha-weak)",
            }}
        >
            <Row fillWidth maxWidth="m" horizontal="between" vertical="center">
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Row gap="8" vertical="center">
                        <Icon name="ai" size="m" />
                        <Heading as="h1" variant="heading-strong-m">
                            {app.name}
                        </Heading>
                    </Row>
                </Link>

                <Row gap="8" vertical="center">
                    <ToggleButton
                        prefixIcon="home"
                        href="/"
                        selected={pathname === "/"}
                    />
                    <ToggleButton
                        prefixIcon="journal"
                        href="/journal"
                        selected={pathname === "/journal"}
                        label="Journal"
                    />
                    <ToggleButton
                        prefixIcon="insights"
                        href="/insights"
                        selected={pathname === "/insights"}
                        label="Insights"
                    />
                    <ToggleButton
                        prefixIcon={theme === "dark" ? "sun" : "moon"}
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    />
                </Row>
            </Row>
        </Row>
    );
}
