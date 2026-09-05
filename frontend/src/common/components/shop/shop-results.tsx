import { PackageOpenIcon } from "lucide-react"

import { cn } from "@/lib/utils/utils"
import { Stagger } from "@/common/components/animation/reveal"
import { ProductCard } from "../catalog/product-card"

import type { ProductCardDto } from "@/lib/models/catalogModels"

export function ShopResults({
    products,
    basePath = "",
    stale,
    onReset,
}: Readonly<{
    products: ProductCardDto[]
    /** Prefix for product links, so a customer stays inside their own section. */
    basePath?: string
    /** True while the grid still shows the previous filter's results. */
    stale?: boolean
    onReset: () => void
}>) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-20 text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <PackageOpenIcon aria-hidden="true" className="size-8" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold">Nothing matched that</h3>
                <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
                    Try widening the price range, dropping a category, or searching for something
                    broader.
                </p>
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    Clear all filters
                </button>
            </div>
        )
    }

    return (
        <Stagger
            as="ul"
            step={40}
            className={cn(
                "grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3",
                // Dim rather than blank out: keeping the old results on screen while
                // the new ones resolve avoids a jarring flash of empty grid.
                stale && "opacity-60"
            )}
        >
            {products.map((product) => (
                <li key={product.variantId} className="relative">
                    <ProductCard product={product} to={`${basePath}/shop?q=${product.slug}`} />
                </li>
            ))}
        </Stagger>
    )
}
