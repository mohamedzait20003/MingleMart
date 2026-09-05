import type { FC } from "react"
import { Outlet } from "react-router-dom"
import { HomeIcon, InfoIcon, StoreIcon, TagIcon } from "lucide-react"

import { Navbar, type MainLinkProps } from "@/common/components/main/navbar"
import { navUrls } from "@/lib/utils/navUrls"

// The same four destinations the visitor shell offers, so the bar does not
// change shape when someone steps into a sign-in flow and back out of it.
const MainLinks: MainLinkProps[] = [
    { to: navUrls.landing.home, label: "Home", icon: HomeIcon, end: true },
    { to: navUrls.landing.shop, label: "Shop", icon: StoreIcon },
    { to: navUrls.landing.deals, label: "Deals", icon: TagIcon },
    { to: navUrls.common.about, label: "About", icon: InfoIcon },
]

/**
 * Shell for the sign-in flows.
 *
 * No action buttons: "Log in" and "Sign up" are the two pages this shell
 * renders, and a bar advertising the page you are already on is noise. The way
 * between them is the link under the form, where someone deciding between them
 * is already looking.
 */
const Layout: FC = () => (
    <div className="flex min-h-dvh flex-col">
        <Navbar MainLinks={MainLinks} homeTo={navUrls.landing.home} />
        <main id="main-content" className="flex-1">
            <Outlet />
        </main>
    </div>
)

export default Layout
