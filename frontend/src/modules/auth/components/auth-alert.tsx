import type { ReactNode } from "react"
import {
    AlertTriangleIcon,
    CheckCircle2Icon,
    CircleAlertIcon,
    InfoIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/common/components/ui/alert"
import { cn } from "@/lib/utils/utils"

type Tone = "error" | "success" | "warning" | "info"

const TONES = {
    error: {
        icon: CircleAlertIcon,
        className: "border-destructive/30 bg-destructive/8 text-destructive",
        live: "assertive",
    },
    success: {
        icon: CheckCircle2Icon,
        className: "border-success/30 bg-success/8 text-success",
        live: "polite",
    },
    warning: {
        icon: AlertTriangleIcon,
        className: "border-warning/30 bg-warning/8 text-warning",
        live: "polite",
    },
    info: {
        icon: InfoIcon,
        className: "border-info/30 bg-info/8 text-info",
        live: "polite",
    },
} as const satisfies Record<Tone, { icon: unknown; className: string; live: "polite" | "assertive" }>

/**
 * Form-level feedback: the things that are wrong with the request rather than
 * with one field.
 *
 * Each tone pairs a colour with an icon and a word, so the difference between
 * "sent" and "failed" survives both a monochrome screen and colour blindness.
 * The description is muted by default in the primitive; here it inherits the
 * tone, because a two-tone alert reads as two separate messages.
 */
export function AuthAlert({
    tone,
    title,
    children,
    className,
}: Readonly<{ tone: Tone; title: string; children?: ReactNode; className?: string }>) {
    const { icon: Icon, className: toneClass, live } = TONES[tone]

    return (
        <Alert
            aria-live={live}
            className={cn(toneClass, "*:data-[slot=alert-description]:text-current/85", className)}
        >
            <Icon aria-hidden="true" />
            <AlertTitle>{title}</AlertTitle>
            {children && <AlertDescription>{children}</AlertDescription>}
        </Alert>
    )
}
