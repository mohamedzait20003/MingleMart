import {
    BoxIcon,
    HomeIcon,
    InfoIcon,
    LayoutDashboardIcon,
    LogInIcon,
    LogOutIcon,
    PackageIcon,
    ShoppingCartIcon,
    StoreIcon,
    TagIcon,
    UserIcon,
    UserPlusIcon,
    UsersIcon,
} from "lucide-react"

import type { ButtonsProps, MainLinkProps } from "@/common/components/main/navbar"

import { navUrls, withUser } from "./navUrls"

/**
 * The navigation each audience sees, in one place.
 *
 * Every shell reads its bar from here rather than declaring one inline, so a
 * page that is shared between audiences - the company pages, the error pages -
 * can show the bar belonging to whoever is looking instead of inventing a bar
 * of its own. Adding a link for customers is one edit, and it reaches every
 * page a customer can be standing on.
 *
 * URLs come from `navUrls`; only the labels and icons live here.
 */

/** What the shell can offer that is not a link: signing out. */
export interface SessionActions {
    logout: () => void
    isLoggingOut: boolean
}

export interface AudienceNav {
    MainLinks: MainLinkProps[]
    Buttons: ButtonsProps[]
    /** Where the brand lockup points for this audience. */
    homeTo: string
}

/** A visitor: browse, and the two ways in. Sign up is the primary action. */
export const landingNav = (): AudienceNav => ({
    homeTo: navUrls.landing.home,
    MainLinks: [
        { to: navUrls.landing.home, label: "Home", icon: HomeIcon, end: true },
        { to: navUrls.landing.shop, label: "Shop", icon: StoreIcon },
        { to: navUrls.landing.deals, label: "Deals", icon: TagIcon },
        { to: navUrls.common.about, label: "About", icon: InfoIcon },
    ],
    Buttons: [
        { to: navUrls.auth.login, label: "Log in", icon: LogInIcon },
        { to: navUrls.auth.signUp, label: "Sign up", icon: UserPlusIcon, variant: "primary" },
    ],
})

/** A signed-in customer, under their own prefix. */
export const customerNav = (
    publicUserId: string | null | undefined,
    { logout, isLoggingOut }: SessionActions,
): AudienceNav => {
    const base = withUser(navUrls.customer.base, publicUserId)

    return {
        homeTo: base,
        MainLinks: [
            { to: base, label: "Shop", icon: StoreIcon, end: true },
            { to: withUser(navUrls.customer.deals, publicUserId), label: "Deals", icon: TagIcon },
            { to: withUser(navUrls.customer.orders, publicUserId), label: "Orders", icon: PackageIcon },
            // Not prefixed: the company pages are mounted once, outside the
            // audience modules.
            { to: navUrls.common.about, label: "About", icon: InfoIcon },
        ],
        Buttons: [
            // Pass `badge` here once cart count lives in the store.
            {
                to: withUser(navUrls.customer.cart, publicUserId),
                label: "Cart",
                icon: ShoppingCartIcon,
                variant: "primary",
            },
            { to: navUrls.profile.base, label: "Profile", icon: UserIcon },
            { label: "Log out", icon: LogOutIcon, onClick: logout, disabled: isLoggingOut },
        ],
    }
}

/** The admin console, under the signed-in admin's own prefix. */
export const adminNav = (
    publicUserId: string | null | undefined,
    { logout, isLoggingOut }: SessionActions,
): AudienceNav => ({
    homeTo: withUser(navUrls.admin.base, publicUserId),
    MainLinks: [
        {
            to: withUser(navUrls.admin.dashboard, publicUserId),
            label: "Dashboard",
            icon: LayoutDashboardIcon,
        },
        { to: withUser(navUrls.admin.users, publicUserId), label: "Users", icon: UsersIcon },
        { to: withUser(navUrls.admin.products, publicUserId), label: "Products", icon: BoxIcon },
        { to: navUrls.common.about, label: "About", icon: InfoIcon },
    ],
    Buttons: [
        { to: navUrls.profile.base, label: "Profile", icon: UserIcon },
        { label: "Log out", icon: LogOutIcon, onClick: logout, disabled: isLoggingOut },
    ],
})

/**
 * Where a viewer belongs: the top of their own shell.
 *
 * Exported separately from `navFor` because the error pages need somewhere to
 * send people without needing a whole bar to do it.
 */
export function homeFor(role: string | null, publicUserId: string | null | undefined): string {
    if (role === "Admin") {
        return withUser(navUrls.admin.base, publicUserId)
    }

    if (role === "Customer") {
        return withUser(navUrls.customer.base, publicUserId)
    }

    return navUrls.landing.home
}

/**
 * Picks the bar for a viewer.
 *
 * Role is the only input, because it is the only thing that decides which shell
 * a person belongs to. An unrecognised role falls back to the visitor bar,
 * whose links are reachable by everyone.
 */
export function navFor(
    role: string | null,
    publicUserId: string | null | undefined,
    actions: SessionActions,
): AudienceNav {
    if (role === "Admin") {
        return adminNav(publicUserId, actions)
    }

    if (role === "Customer") {
        return customerNav(publicUserId, actions)
    }

    return landingNav()
}
