import type { FC } from "react"
import { CompassIcon } from "lucide-react"

import { useUser } from "@/lib/hooks/useUser"
import { navUrls } from "@/lib/utils/navUrls"
import { homeFor } from "@/lib/utils/navLinks"
import { ErrorPage, ErrorPrimaryLink, ErrorSecondaryLink } from "../components/error-page"


const NotFound: FC = () => {
    const { user, role, isAuthenticated } = useUser()
    const home = homeFor(isAuthenticated ? role : null, user.publicUserId)

    return (
        <ErrorPage
            status={404}
            icon={CompassIcon}
            title="We cannot find that page"
            description="The link may be out of date, or the page may have moved. Nothing is broken on your side."
            actions={
                <>
                    <ErrorPrimaryLink to={home}>Take me back</ErrorPrimaryLink>
                    <ErrorSecondaryLink to={navUrls.common.about}>
                        Read about us instead
                    </ErrorSecondaryLink>
                </>
            }
        />
    )
}

export default NotFound
