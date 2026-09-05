import type { ComponentProps, ReactNode } from "react"
import { ArrowRightIcon } from "lucide-react"

import { Spinner } from "@/common/components/ui/spinner"
import { Magnetic } from "@/common/components/animation/magnetic"
import { Shine } from "@/common/components/animation/shine"
import { cn } from "@/lib/utils/utils"

type SubmitButtonProps = Omit<ComponentProps<"button">, "children"> & {
    children: ReactNode
    /** Swapped in while the request is in flight, e.g. "Signing in…". */
    pendingLabel: string
    pending?: boolean
}

/**
 * The single primary action on an auth page.
 *
 * While the request is in flight the button holds its own width, swaps its
 * label, and goes `aria-busy` — the label change is what tells a screen-reader
 * user that the press registered, which a spinner alone never does. It is also
 * genuinely disabled, so a second press cannot submit the form twice.
 */
export function SubmitButton({
    children,
    pendingLabel,
    pending = false,
    disabled,
    className,
    ...props
}: Readonly<SubmitButtonProps>) {
    return (
        <Magnetic className="w-full" strength={0.2} limit={6}>
            <button
                type="submit"
                aria-busy={pending}
                disabled={pending || disabled}
                data-shine-host=""
                className={cn(
                    "relative inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl",
                    "bg-primary px-6 font-semibold text-primary-foreground shadow-sm",
                    "transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40",
                    "disabled:pointer-events-none disabled:opacity-60",
                    className
                )}
                {...props}
            >
                {pending ? (
                    <>
                        <Spinner aria-hidden="true" className="size-5" />
                        {pendingLabel}
                    </>
                ) : (
                    <>
                        {children}
                        <ArrowRightIcon aria-hidden="true" className="size-5" />
                    </>
                )}
                {!pending && (
                    <Shine mode="hover" className="text-primary-foreground/40" duration={1.4} />
                )}
            </button>
        </Magnetic>
    )
}
