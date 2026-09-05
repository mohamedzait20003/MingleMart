import type { FC } from "react"
import { LockIcon } from "lucide-react"

import { homeFor } from "@/lib/utils/navLinks"
import { navUrls } from "@/lib/utils/navUrls"
import { useUser } from "@/lib/hooks/useUser"

import { ErrorPage, ErrorPrimaryLink, ErrorSecondaryLink } from "../components/error-page"

/**
 * Where the route guard sends a signed-in reader whose role does not carry the
 * page - a customer following a link into the admin console, say.
 *
 * Signing in again is offered only to someone who is not signed in, which
 * should not happen here: an anonymous request is sent to the login page with a
 * callback, not here. It is offered anyway because the alternative, if the
 * session has since lapsed, is a page with no way forward at all.
 */
const Unauthorized: FC = () => {
    const { user, role, isAuthenticated } = useUser()
    const home = homeFor(isAuthenticated ? role : null, user.publicUserId)

    return (
        <ErrorPage
            status={403}
            icon={LockIcon}
            title="That page is not yours to open"
            description={
                isAuthenticated
                    ? "Your account does not have access to it. If you think it should, ask an administrator."
                    : "You need to be signed in with an account that has access to it."
            }
            actions={
                <>
                    <ErrorPrimaryLink to={home}>Back to your area</ErrorPrimaryLink>
                    {!isAuthenticated && (
                        <ErrorSecondaryLink to={navUrls.auth.login}>
                            Sign in with another account
                        </ErrorSecondaryLink>
                    )}
                </>
            }
        />
    )
}

export default Unauthorized
