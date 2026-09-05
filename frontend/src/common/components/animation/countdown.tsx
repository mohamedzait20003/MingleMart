import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils/utils"

const PLACEHOLDER = "--"

const UNITS = [
    { key: "hours", label: "Hours" },
    { key: "minutes", label: "Minutes" },
    { key: "seconds", label: "Seconds" },
] as const

function pad(value: number) {
    return String(Math.max(0, value)).padStart(2, "0")
}

/**
 * Ticks down to `to`.
 *
 * Server and client clocks never agree to the second, so the markup ships a
 * neutral placeholder and the live figures are written in after mount. That
 * sidesteps a hydration mismatch without resorting to suppressHydrationWarning,
 * and the digits are `tabular-nums` so the row does not jitter as they change.
 */
export function Countdown({ to, className }: Readonly<{ to: Date | number; className?: string }>) {
    const refs = useRef<Record<string, HTMLSpanElement | null>>({})

    useEffect(() => {
        const target = to instanceof Date ? to.getTime() : to

        const render = () => {
            const remaining = Math.max(0, target - Date.now())
            const totalSeconds = Math.floor(remaining / 1000)
            const values: Record<string, number> = {
                hours: Math.floor(totalSeconds / 3600),
                minutes: Math.floor((totalSeconds % 3600) / 60),
                seconds: totalSeconds % 60,
            }
            for (const { key } of UNITS) {
                const node = refs.current[key]
                if (node) node.textContent = pad(values[key])
            }
            return remaining
        }

        if (render() === 0) return
        const timer = setInterval(() => {
            if (render() === 0) clearInterval(timer)
        }, 1000)
        return () => clearInterval(timer)
    }, [to])

    return (
        <div className={cn("flex items-center gap-2", className)} role="timer" aria-live="off">
            {UNITS.map(({ key, label }, index) => (
                <div key={key} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <span
                            ref={(node) => {
                                refs.current[key] = node
                            }}
                            className="min-w-[2.5ch] rounded-lg bg-foreground/10 px-2 py-1.5 text-center text-xl font-bold tabular-nums"
                        >
                            {PLACEHOLDER}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold tracking-wider uppercase opacity-70">
                            {label}
                        </span>
                    </div>
                    {index < UNITS.length - 1 && (
                        <span aria-hidden="true" className="-mt-4 text-xl font-bold opacity-40">
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    )
}
