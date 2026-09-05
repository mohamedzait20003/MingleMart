import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRightIcon, SearchIcon, TruckIcon } from "lucide-react"

import { Input } from "@/common/components/ui/input"
import { Skeleton } from "@/common/components/ui/skeleton"
import { CountUp } from "@/common/components/animation/count-up"
import { Reveal } from "@/common/components/animation/reveal"
import { CategoryIcon } from "@/common/components/catalog/category-icon"
import { TONE_CLASS, toneFor } from "@/lib/utils/category-visual"
import { formatMoney } from "@/lib/models/catalogModels"
import { useLanding } from "@/lib/hooks/useCatalog"

/** Staggered float offsets, so the four tiles never drift in unison. */
const FLOAT_DELAYS = [0, 600, 300, 900]

export function Hero() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")

    const { trending, categories, isLoading } = useLanding()

    // The four most-wanted products, the same list the Trending strip below is
    // drawn from - so the hero is showing stock that actually exists rather than
    // four invented placeholders.
    const showcase = trending.slice(0, 4)

    // Real departments instead of guessed search terms.
    const popular = categories.slice(0, 4)

    // The catalogue already counts itself per department; summing is cheaper and
    // more honest than a rounded marketing figure.
    const productCount = categories.reduce((sum, category) => sum + category.productCount, 0)

    // Search is the primary action for a marketplace, so it submits as a real
    // form: Enter works, and the result is a shareable URL.
    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = query.trim()
        navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop")
    }

    const stats = [
        // Omitted until the count is known: "0+ products listed" is worse than
        // one fewer statistic.
        ...(productCount > 0
            ? [{ value: <CountUp to={productCount} suffix="+" />, label: "Products listed" }]
            : []),
        { value: <CountUp to={4.9} decimals={1} />, label: "Average rating" },
        { value: <CountUp to={30} suffix="-day" />, label: "Free returns" },
    ]

    return (
        <section className="relative overflow-hidden">
            {/* Decorative wash. Sits behind everything and is never announced. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-1">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background" />
                <div
                    data-float=""
                    style={{ "--float-duration": "9s", "--float-distance": "-24px" }}
                    className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-brand-2/20 blur-3xl"
                />
                <div
                    data-float=""
                    style={{ "--float-duration": "11s", "--float-distance": "20px", "--float-delay": "1.2s" }}
                    className="absolute -top-16 right-0 size-[24rem] rounded-full bg-brand-3/20 blur-3xl"
                />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
                <div>
                    <Reveal className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-sm backdrop-blur">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                            <TruckIcon aria-hidden="true" className="size-3.5" />
                            Free
                        </span>
                        <span className="text-muted-foreground">shipping on orders over $50</span>
                    </Reveal>

                    <Reveal
                        delay={80}
                        as="h1"
                        className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                    >
                        Everything you love,{" "}
                        <span className="bg-[linear-gradient(100deg,var(--brand-2),var(--brand-3))] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-foreground">
                            one marketplace
                        </span>
                        .
                    </Reveal>

                    <Reveal
                        delay={160}
                        as="p"
                        className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground"
                    >
                        Thousands of independent sellers, one checkout. Find it, love it, and send
                        it back free if it is not quite right.
                    </Reveal>

                    <Reveal delay={240} className="mt-8">
                        <form onSubmit={onSubmit} role="search" className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <label htmlFor="hero-search" className="sr-only">
                                    Search products
                                </label>
                                <SearchIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
                                />
                                <Input
                                    id="hero-search"
                                    type="search"
                                    name="q"
                                    autoComplete="off"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search for anything"
                                    className="h-14 rounded-xl pl-12 text-base shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-sm transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                            >
                                Search
                                <ArrowRightIcon aria-hidden="true" className="size-5" />
                            </button>
                        </form>

                        {popular.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground">Popular:</span>
                                {popular.map(({ id, slug, name }) => (
                                    <Link
                                        key={id}
                                        to={`/shop?category=${slug}`}
                                        className="inline-flex h-9 items-center rounded-full border border-border px-3 text-sm text-muted-foreground transition-colors outline-none hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/40"
                                    >
                                        {name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Reveal>

                    <Reveal delay={320} as="dl" className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <dt className="sr-only">{label}</dt>
                                <dd>
                                    <span className="block font-heading text-3xl font-extrabold">
                                        {value}
                                    </span>
                                    <span aria-hidden="true" className="text-sm text-muted-foreground">
                                        {label}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </Reveal>
                </div>

                {/*
                    Real products now, so the tiles are links rather than decoration.
                    They were `aria-hidden` while they were four invented placeholders;
                    hiding actual stock with actual prices would be the wrong call.
                */}
                {(isLoading || showcase.length > 0) && (
                    <Reveal delay={200} className="relative grid grid-cols-2 gap-4 sm:gap-5">
                        {isLoading
                            ? FLOAT_DELAYS.map((delay, index) => (
                                <div key={delay} className={index % 2 === 1 ? "mt-8" : ""}>
                                    <Skeleton className="h-52 rounded-2xl" />
                                </div>
                            ))
                            : showcase.map((product, index) => (
                                <Link
                                    key={product.variantId}
                                    to={`/shop?q=${product.slug}`}
                                    data-float=""
                                    style={{
                                        "--float-delay": `${FLOAT_DELAYS[index]}ms`,
                                        "--float-duration": "7.5s",
                                    }}
                                    className={`rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow outline-none hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/40 ${
                                        index % 2 === 1 ? "mt-8" : ""
                                    }`}
                                >
                                    <div
                                        className={`flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${TONE_CLASS[toneFor(product.categorySlug)]}`}
                                    >
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt=""
                                                // Above the fold: deferring these is
                                                // what delays the largest paint.
                                                loading="eager"
                                                fetchPriority="high"
                                                decoding="async"
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <CategoryIcon
                                                slug={product.categorySlug}
                                                className="size-10"
                                            />
                                        )}
                                    </div>
                                    <p className="mt-3 truncate text-sm font-semibold">
                                        {product.name}
                                    </p>
                                    <p className="text-sm font-bold text-primary tabular-nums">
                                        {formatMoney(product.price)}
                                    </p>
                                </Link>
                            ))}
                    </Reveal>
                )}
            </div>
        </section>
    )
}
