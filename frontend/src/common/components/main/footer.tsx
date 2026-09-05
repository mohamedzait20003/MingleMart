import type { FC } from "react"
import { Link } from "react-router-dom"

import Logo, { LogoMark } from "./logo"
import { navUrls } from "@/lib/utils/navUrls"

const YEAR = new Date().getFullYear()

const COMMON_LINKS = [
    { to: navUrls.common.about, label: "About us" },
    { to: navUrls.common.careers, label: "Careers" },
    { to: navUrls.common.faqs, label: "FAQs" },
    { to: navUrls.common.support, label: "Support" },
    { to: navUrls.common.sell, label: "Sell on MingleMart" },
    { to: navUrls.common.accessibility, label: "Accessibility" },
    { to: navUrls.common.privacy, label: "Privacy policy" },
    { to: navUrls.common.terms, label: "Terms of service" },
]

export const Footer: FC = () => (
    <footer className="relative overflow-hidden border-t border-border bg-card">
        <LogoMark
            aria-hidden="true"
            tone="mono"
            className="pointer-events-none absolute -right-16 -bottom-20 size-72 text-foreground/4 sm:-right-10 sm:size-96"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-24">
                <div className="max-w-md">
                    <Logo size="lg" to={navUrls.landing.home} />
                    <p className="mt-5 text-pretty text-muted-foreground">
                        Thousands of independent sellers, one basket and one checkout. Find it,
                        love it, and send it back free if it is not quite right.
                    </p>
                </div>
                <nav aria-label="Site links" className="mt-4 lg:mt-0 lg:self-center">
                    <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-4">
                        {COMMON_LINKS.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="inline-flex min-h-11 items-center rounded-md text-sm whitespace-nowrap text-muted-foreground transition-colors duration-200 outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    © {YEAR} MingleMart. All rights reserved.
                </p>
                <p className="text-sm text-muted-foreground">
                    Prices shown in USD, tax included where applicable.
                </p>
            </div>
        </div>
    </footer>
)

export default Footer
