import type { FC } from "react"
import { Outlet, useParams } from "react-router-dom"

import { Navbar } from "@/common/components/main/navbar"
import { customerNav } from "@/lib/utils/navLinks"
import { useUser } from "@/lib/hooks/useUser"

const Layout: FC = () => {
    // Read straight off the route rather than the store: the guard has already
    // checked this id against the session, and the shell stays usable while the
    // store is rehydrating.
    const { publicUserId } = useParams()
    const { logout, isLoggingOut } = useUser()

    const { MainLinks, Buttons, homeTo } = customerNav(publicUserId, { logout, isLoggingOut })

    return (
        <div className="flex min-h-dvh flex-col">
            <Navbar
                MainLinks={MainLinks}
                Buttons={Buttons}
                isAuthenticated
                homeTo={homeTo}
            />
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
