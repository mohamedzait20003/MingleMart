import type { FC } from "react"
import { Outlet } from "react-router-dom"

import { Navbar } from "@/common/components/main/navbar"
import { landingNav } from "@/lib/utils/navLinks"

/**
 * The visitor shell.
 *
 * The bar itself lives in `navLinks`, shared with every page a visitor can
 * reach from here - the company pages included, which is what keeps `/about`
 * looking the same whether it is reached from this shell or from a signed-in
 * one.
 */
const { MainLinks, Buttons, homeTo } = landingNav()

const Layout: FC = () => (
    <div className="flex min-h-dvh flex-col">
        <Navbar MainLinks={MainLinks} Buttons={Buttons} homeTo={homeTo} />
        <main id="main-content" className="flex-1">
            <Outlet />
        </main>
    </div>
)

export default Layout
