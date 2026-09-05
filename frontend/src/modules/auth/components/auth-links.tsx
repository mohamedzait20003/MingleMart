import type { ComponentProps, ReactNode } from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils/utils"

/**
 * An inline link inside auth copy.
 *
 * Underlined by default rather than on hover: on a page that is mostly form
 * controls, a coloured word with no other affordance is easy to miss and
 * impossible to see at all without colour vision.
 */
export function AuthLink({ className, ...props }: Readonly<ComponentProps<typeof Link>>) {
    return (
        <Link
            className={cn(
                "rounded-sm font-semibold text-primary underline underline-offset-4",
                "transition-colors outline-none hover:no-underline focus-visible:ring-3 focus-visible:ring-ring/40",
                className
            )}
            {...props}
        />
    )
}

/**
 * The route out of this page and into the other half of the flow — sign in from
 * sign up, and back again.
 *
 * Rendered under the card rather than as a second button inside it, so the form
 * keeps exactly one primary action while the alternative stays one tap away.
 */
export function AuthSwitch({
    prompt,
    to,
    label,
}: Readonly<{ prompt: string; to: string; label: ReactNode }>) {
    return (
        <p className="text-muted-foreground">
            {prompt} <AuthLink to={to}>{label}</AuthLink>
        </p>
    )
}

/**
 * Full-width secondary action, for outcome screens where the alternative route
 * matters as much as the primary one.
 */
export function AuthSecondaryLink({ className, ...props }: Readonly<ComponentProps<typeof Link>>) {
    return (
        <Link
            className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border",
                "px-5 font-semibold transition-colors outline-none hover:bg-muted",
                "focus-visible:ring-3 focus-visible:ring-ring/40",
                className
            )}
            {...props}
        />
    )
}

/**
 * Full-width primary action for outcome screens, matching `SubmitButton` so a
 * confirmation page and a form page do not resolve differently.
 */
export function AuthPrimaryLink({ className, ...props }: Readonly<ComponentProps<typeof Link>>) {
    return (
        <Link
            className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary",
                "px-5 font-semibold text-primary-foreground shadow-sm transition-colors outline-none",
                "hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40",
                className
            )}
            {...props}
        />
    )
}
