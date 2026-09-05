import type { ReactNode } from "react"

import { Aurora } from "@/common/components/animation/aurora"
import { cn } from "@/lib/utils/utils"
import { AuthShowcase } from "./auth-showcase"

type AuthShellProps = {
    children: ReactNode
    /**
     * Show the brand panel beside the form. On for the two pages where someone
     * is deciding whether to hand over an email; off for the ones where they
     * have already committed and only need an outcome.
     */
    showcase?: boolean
}

/**
 * Frame for every page under /authenticate.
 *
 * The form column is capped near 28rem and centred: a sign-in form that
 * stretches to a 1440px viewport is harder to fill in, not easier. On large
 * screens the leftover space earns its keep as a reason to sign up rather than
 * as padding, and below `lg` that panel is simply not rendered — it is
 * reassurance, and reassurance never outranks the form on a phone.
 */
export function AuthShell({ children, showcase = false }: Readonly<AuthShellProps>) {
    return (
        <div className="relative isolate overflow-hidden">
            <Aurora tone="brand" intensity={0.7} grid className="-z-1" />

            <div
                className={cn(
                    "mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:px-8 lg:py-16",
                    showcase ? "lg:grid-cols-2 lg:items-center lg:gap-16" : "place-items-center"
                )}
            >
                {showcase && <AuthShowcase />}

                <div
                    className={cn(
                        "w-full max-w-md",
                        showcase ? "mx-auto lg:mx-0 lg:justify-self-end" : "mx-auto"
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
