import {
    DumbbellIcon,
    LaptopIcon,
    PackageIcon,
    ShirtIcon,
    SofaIcon,
    SparklesIcon,
    ToyBrickIcon,
} from "lucide-react"

/**
 * Stand-in artwork for a department.
 *
 * Written as a switch returning finished elements rather than as a lookup that
 * hands back a component to render. Selecting a component during render is
 * something the React Compiler refuses to compile - each branch here names a
 * constant, so the mapping stays dynamic while the components stay static.
 *
 * Keyed by category slug rather than by product, so a newly seeded product
 * lands on a sensible glyph without anyone editing a table. The catalogue
 * carries `imageUrl` and callers prefer it; this is the fallback.
 */
export function CategoryIcon({
    slug,
    className,
}: Readonly<{ slug: string; className?: string }>) {
    switch (slug) {
        case "electronics":
            return <LaptopIcon aria-hidden="true" className={className} />
        case "fashion":
            return <ShirtIcon aria-hidden="true" className={className} />
        case "home-living":
            return <SofaIcon aria-hidden="true" className={className} />
        case "beauty":
            return <SparklesIcon aria-hidden="true" className={className} />
        case "sports":
            return <DumbbellIcon aria-hidden="true" className={className} />
        case "toys-games":
            return <ToyBrickIcon aria-hidden="true" className={className} />
        default:
            // An unknown department still gets a tile rather than a hole.
            return <PackageIcon aria-hidden="true" className={className} />
    }
}
