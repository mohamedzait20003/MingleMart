import { useCallback, useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectTheme, themeChanged } from "@/store/slices/genSlice"

import type { Theme } from "@/lib/models/genModels"

export type { Theme }

/**
 * Where redux-persist keeps the `gen` slice.
 *
 * Exported because two other places need it and neither can import the store:
 * the pre-paint script in index.html, and the cross-tab listener below. Kept in
 * sync with the `key` passed to `persistReducer` in store/index.tsx.
 */
export const GEN_PERSIST_KEY = "persist:gen"

/** Paints the resolved theme. `colorScheme` also themes scrollbars and native controls. */
export function applyTheme(theme: Theme) {
    const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    const root = document.documentElement
    root.classList.toggle("dark", dark)
    root.style.colorScheme = dark ? "dark" : "light"
}

/**
 * Theme preference, persisted by redux-persist rather than by hand.
 *
 * This hook no longer reads or writes localStorage: dispatching is enough, and
 * persistence is the store's job. What it still owns is the DOM side — the
 * class and `color-scheme` that Redux cannot set — plus the two events that
 * change the resolved theme without a dispatch: another tab, and the OS.
 */
export function useTheme() {
    const theme = useAppSelector(selectTheme)
    const dispatch = useAppDispatch()

    const setTheme = useCallback(
        (next: Theme) => {
            applyTheme(next)
            dispatch(themeChanged(next))
        },
        [dispatch]
    )

    // Rehydration lands after the first render, so repaint once the store
    // catches up. Also covers a dispatch from anywhere other than setTheme.
    useEffect(() => {
        applyTheme(theme)
    }, [theme])

    // Another tab changed the preference. redux-persist writes the whole slice
    // as JSON with each value itself JSON-encoded, so unwrap twice.
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== GEN_PERSIST_KEY || !event.newValue) return

            try {
                const next = JSON.parse(JSON.parse(event.newValue).theme) as Theme
                dispatch(themeChanged(next))
            } catch {
                // Malformed or partially written entry: leave the theme alone.
            }
        }

        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [dispatch])

    // Only "system" tracks the OS; an explicit choice must outlast OS changes.
    useEffect(() => {
        if (theme !== "system") return
        const query = window.matchMedia("(prefers-color-scheme: dark)")
        const onChange = () => applyTheme("system")
        query.addEventListener("change", onChange)
        return () => query.removeEventListener("change", onChange)
    }, [theme])

    return { theme, setTheme }
}
