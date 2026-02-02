import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./globals.scss";
import { Metadata, Viewport } from "next";
import { baseURL, fonts, style, app } from "@/resources";
import { Background, Column, Flex, Row } from "@once-ui-system/core";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import classNames from "classnames";

export const metadata: Metadata = {
    title: {
        template: `%s | ${app.name}`,
        default: `${app.name} - ${app.tagline}`,
    },
    description: app.description,
    metadataBase: new URL(baseURL),
    openGraph: {
        title: app.name,
        description: app.description,
        type: "website",
        locale: "en_US",
        siteName: app.name,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={classNames(
                fonts.heading.variable,
                fonts.body.variable,
                fonts.label.variable,
                fonts.code.variable
            )}
            suppressHydrationWarning
        >
            <head />
            <body>
                <Providers>
                    <Background
                        position="absolute"
                        gradient={{
                            display: true,
                            opacity: 60,
                            x: 50,
                            y: 0,
                            width: 80,
                            height: 60,
                            tilt: 0,
                            colorStart: "brand-background-strong",
                            colorEnd: "page-background",
                        }}
                        dots={{
                            display: true,
                            opacity: 20,
                            size: "2",
                            color: "brand-background-strong",
                        }}
                    />
                    <Column style={{ minHeight: "100vh" }} horizontal="center">
                        <Header />
                        <Column
                            as="main"
                            fillWidth
                            maxWidth="m"
                            paddingX="24"
                            paddingY="32"
                            gap="32"
                        >
                            {children}
                        </Column>
                    </Column>
                </Providers>
            </body>
        </html>
    );
}
