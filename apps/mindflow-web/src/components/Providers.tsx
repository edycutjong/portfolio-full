"use client";

import { useEffect } from "react";
import {
    BorderStyle,
    ChartMode,
    ChartVariant,
    DataThemeProvider,
    IconProvider,
    LayoutProvider,
    NeutralColor,
    ScalingSize,
    Schemes,
    SolidStyle,
    SolidType,
    SurfaceStyle,
    ThemeProvider,
    ToastProvider,
    TransitionStyle,
} from "@once-ui-system/core";
import { style, dataStyle } from "@/resources";
import { iconLibrary } from "@/resources/icons";

export function Providers({ children }: { children: React.ReactNode }) {
    // Suppress React key warnings from Once UI library internals (temporary workaround)
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            const originalError = console.error;
            console.error = (...args) => {
                if (
                    typeof args[0] === "string" &&
                    args[0].includes("Each child in a list should have a unique")
                ) {
                    return;
                }
                originalError.apply(console, args);
            };
            return () => {
                console.error = originalError;
            };
        }
    }, []);

    return (
        <LayoutProvider>
            <ThemeProvider
                brand={style.brand as Schemes}
                accent={style.accent as Schemes}
                neutral={style.neutral as NeutralColor}
                solid={style.solid as SolidType}
                solidStyle={style.solidStyle as SolidStyle}
                border={style.border as BorderStyle}
                surface={style.surface as SurfaceStyle}
                transition={style.transition as TransitionStyle}
                scaling={style.scaling as ScalingSize}
            >
                <DataThemeProvider
                    variant={dataStyle.variant as ChartVariant}
                    mode={dataStyle.mode as ChartMode}
                    height={dataStyle.height}
                    axis={{
                        stroke: dataStyle.axis.stroke,
                    }}
                    tick={{
                        fill: dataStyle.tick.fill,
                        fontSize: dataStyle.tick.fontSize,
                        line: dataStyle.tick.line,
                    }}
                >
                    <ToastProvider>
                        <IconProvider icons={iconLibrary}>{children}</IconProvider>
                    </ToastProvider>
                </DataThemeProvider>
            </ThemeProvider>
        </LayoutProvider>
    );
}
