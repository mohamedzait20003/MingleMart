import { useSyncExternalStore } from "react"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"

import { Separator } from "@/common/components/ui/separator"
import { Skeleton } from "@/common/components/ui/skeleton"
import { useTheme } from "@/lib/hooks/useTheme"

/** No subscription: the snapshot only differs between server and client. */
const NEVER_CHANGES = () => () => {}

type GooglePanelProps = {
    onSuccess: (credential: CredentialResponse) => void
    onError: () => void
    /** Text under the divider, e.g. "or sign in with email". */
    dividerLabel: string
    disabled?: boolean
}

/**
 * Google sign-in, above the email form.
 *
 * The widget is a Google-owned iframe, so it cannot be themed with our tokens —
 * the most we can do is pick the variant that does not glare on a dark page.
 * It also cannot render on the server, so a skeleton of the same height holds
 * the space until it mounts; without that the whole form jumps down when the
 * button arrives.
 */
export function GooglePanel({
    onSuccess,
    onError,
    dividerLabel,
    disabled,
}: Readonly<GooglePanelProps>) {
    const { theme } = useTheme()

    // `false` on the server and through hydration, `true` afterwards — which is
    // exactly what an "is this the client yet" flag needs, without a setState
    // in an effect kicking off a second render pass.
    const hydrated = useSyncExternalStore(
        NEVER_CHANGES,
        () => true,
        () => false
    )

    // The stored preference can be "system", which only the media query resolves.
    const dark =
        theme === "dark" ||
        (theme === "system" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <div className="flex flex-col gap-6">
            <div
                className="flex min-h-11 justify-center [&>div]:w-full [&_iframe]:mx-auto!"
                // The widget owns its own focus and labelling; disabling the
                // wrapper is the only way to stop a second submission mid-flight.
                aria-disabled={disabled}
                style={disabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
            >
                {hydrated ? (
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        size="large"
                        width="100%"
                        text="continue_with"
                        shape="rectangular"
                        theme={dark ? "filled_black" : "outline"}
                    />
                ) : (
                    <Skeleton className="h-11 w-full rounded-lg" />
                )}
            </div>

            {/* Two rules either side of the label rather than the stock
                separator: that one hides the line behind an opaque chip, which
                only matches on an opaque surface — and this card is not one. */}
            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {dividerLabel}
                </span>
                <Separator className="flex-1" />
            </div>
        </div>
    )
}
