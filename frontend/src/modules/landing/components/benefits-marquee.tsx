import {
    BadgeCheckIcon,
    HeadsetIcon,
    RotateCcwIcon,
    ShieldCheckIcon,
    TruckIcon,
    WalletIcon,
} from "lucide-react"

import { Marquee } from "@/common/components/animation/marquee"

const BENEFITS = [
    { icon: TruckIcon, label: "Free shipping over $50" },
    { icon: RotateCcwIcon, label: "30-day free returns" },
    { icon: ShieldCheckIcon, label: "Encrypted checkout" },
    { icon: HeadsetIcon, label: "24/7 human support" },
    { icon: BadgeCheckIcon, label: "Verified sellers only" },
    { icon: WalletIcon, label: "Price-match promise" },
]

/**
 * Reassurance strip between the hero and the catalogue.
 *
 * A ticker rather than a static row because the six promises do not fit on a
 * phone without either shrinking below a readable size or stacking into a wall.
 */
export function BenefitsMarquee() {
    return (
        <section
            aria-label="Why shop with MingleMart"
            className="border-y border-border bg-muted/40 py-5"
        >
            <Marquee duration={38}>
                <ul className="flex items-center">
                    {BENEFITS.map(({ icon: Icon, label }) => (
                        <li
                            key={label}
                            className="flex items-center gap-2.5 px-6 whitespace-nowrap sm:px-8"
                        >
                            <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
                            <span className="text-sm font-medium">{label}</span>
                            <span
                                aria-hidden="true"
                                className="ml-6 size-1.5 rounded-full bg-border sm:ml-8"
                            />
                        </li>
                    ))}
                </ul>
            </Marquee>
        </section>
    )
}
