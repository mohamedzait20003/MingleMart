import { type FC } from "react"
import { Outlet, useParams } from "react-router-dom"

import { Navbar } from "@/common/components/main/navbar"
import { adminNav } from "@/lib/utils/navLinks"
import { useUser } from "@/lib/hooks/useUser"

const Layout: FC = () => {
    const { publicUserId } = useParams()
    const { logout, isLoggingOut } = useUser()

    const { MainLinks, Buttons, homeTo } = adminNav(publicUserId, { logout, isLoggingOut })

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
