import { useDeals } from "@/lib/hooks/useCatalog"
import { DealPerks } from "./deal-perks"
import { DealsBrowser } from "./deals-browser"
import { DealsHero } from "./deals-hero"
import { FlashDeals } from "./flash-deals"
import { SavingsTicker } from "./savings-ticker"

/**
 * The deals page, shared by the visitor route (`/deals`) and the signed-in one
 * (`/user/:id/deals`).
 *
 * Order follows the decision, not the inventory: the offer and its deadline,
 * proof that other people are acting on it, the four best cuts, the full list
 * to browse, and then the objections.
 *
 * The closing newsletter ask is not here. It is a landing-page section, and
 * pulling it in would make this shared component depend on a feature module -
 * so each deals page renders it after this one instead.
 *
 * One `useDeals()` call feeds all of it. The hero's totals, the flash strip and
 * the grid are three views of a single response, so the headline "biggest
 * discount today" is guaranteed to be a discount that is actually below it on
 * the page.
 *
 * `basePath` is the prefix every product link needs, so the same component can
 * point at `/shop` for a visitor and `/user/abc/shop` for a customer without
 * either page knowing about the other's routing.
 */
export function DealsView({ basePath = "" }: Readonly<{ basePath?: string }>) {
    const { summary, flash, daily, categories, isLoading } = useDeals()

    return (
        <>
            <DealsHero
                basePath={basePath}
                summary={summary}
                // The three deepest cuts are the top of the flash strip, which the
                // server has already sorted; slicing here avoids a second opinion
                // about what "deepest" means.
                preview={flash.slice(0, 3)}
            />
            <SavingsTicker />
            <FlashDeals basePath={basePath} deals={flash} endsAt={summary.nextEndsAt} isLoading={isLoading} />
            <DealsBrowser basePath={basePath} deals={daily} categories={categories} />
            <DealPerks />
        </>
    )
}
