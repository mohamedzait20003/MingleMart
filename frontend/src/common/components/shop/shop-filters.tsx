import { StarIcon } from "lucide-react"

import { Checkbox } from "@/common/components/ui/checkbox"
import { Label } from "@/common/components/ui/label"
import { Separator } from "@/common/components/ui/separator"
import { Slider } from "@/common/components/ui/slider"
import { cn } from "@/lib/utils/utils"
import { PRICE_CEILING, PRICE_FLOOR, type ShopFilters } from "@/lib/utils/catalog"

import type { CategoryFacet } from "@/lib/models/catalogModels"

const RATING_STEPS = [4, 3, 2] as const

const money = (value: number) =>
    value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    })

type Props = {
    filters: ShopFilters
    /**
     * Departments and their counts, straight from the response.
     *
     * Catalogue-wide figures, so a facet does not drop to zero the moment an
     * unrelated filter is applied - the count answers "what else is there",
     * which is only useful if it counts what is actually there.
     */
    categories: CategoryFacet[]
    apply: (patch: Partial<ShopFilters>) => void
    /** Sheet variant drops the outer card so it sits flush in the drawer. */
    bare?: boolean
}

function Group({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
    return (
        <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-semibold">{title}</legend>
            {children}
        </fieldset>
    )
}

export function ShopFiltersPanel({ filters, categories, apply, bare = false }: Readonly<Props>) {
    const toggleCategory = (slug: string, checked: boolean) => {
        apply({
            categories: checked
                ? [...filters.categories, slug]
                : filters.categories.filter((value) => value !== slug),
        })
    }

    return (
        <div
            className={cn(
                "flex flex-col gap-6",
                !bare && "rounded-2xl border border-border bg-card p-5"
            )}
        >
            {categories.length > 0 && (
                <>
                    <Group title="Category">
                        {categories.map(({ slug, name, count }) => {
                            const id = `filter-category-${slug}`
                            return (
                                <div key={slug} className="flex items-center gap-3">
                                    <Checkbox
                                        id={id}
                                        checked={filters.categories.includes(slug)}
                                        onCheckedChange={(checked) =>
                                            toggleCategory(slug, checked === true)
                                        }
                                    />
                                    {/* Padded label keeps the tap target at 44px without a chunky row. */}
                                    <Label
                                        htmlFor={id}
                                        className="flex flex-1 cursor-pointer items-center justify-between py-2.5 text-sm font-normal"
                                    >
                                        {name}
                                        <span className="text-xs text-muted-foreground tabular-nums">
                                            {count}
                                        </span>
                                    </Label>
                                </div>
                            )
                        })}
                    </Group>

                    <Separator />
                </>
            )}

            <Group title="Price">
                <Slider
                    value={[filters.min, filters.max]}
                    min={PRICE_FLOOR}
                    max={PRICE_CEILING}
                    step={5}
                    minStepsBetweenValues={1}
                    aria-label="Price range"
                    onValueChange={(value) => {
                        const [min, max] = value as number[]
                        apply({ min, max })
                    }}
                />
                <p className="flex items-center justify-between text-sm tabular-nums">
                    <span>{money(filters.min)}</span>
                    <span className="text-muted-foreground">
                        {filters.max === PRICE_CEILING ? `${money(filters.max)}+` : money(filters.max)}
                    </span>
                </p>
            </Group>

            <Separator />

            <Group title="Rating">
                <div className="flex flex-col gap-1">
                    {RATING_STEPS.map((step) => {
                        const active = filters.rating === step
                        return (
                            <button
                                key={step}
                                type="button"
                                aria-pressed={active}
                                onClick={() => apply({ rating: active ? 0 : step })}
                                className={cn(
                                    "flex h-11 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm transition-colors outline-none",
                                    "focus-visible:ring-3 focus-visible:ring-ring/40",
                                    active
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "hover:bg-muted"
                                )}
                            >
                                <span className="flex text-warning">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <StarIcon
                                            key={index}
                                            aria-hidden="true"
                                            className={cn(
                                                "size-4",
                                                index < step ? "fill-current" : "opacity-25"
                                            )}
                                        />
                                    ))}
                                </span>
                                {step} and up
                            </button>
                        )
                    })}
                </div>
            </Group>

            {/*
                No availability filter. `ProductCardDto` carries no stock field and
                the shop endpoint takes no stock parameter, so the control that used
                to be here could only have filtered on something invented locally.
                It returns when the catalogue publishes availability.
            */}
        </div>
    )
}
