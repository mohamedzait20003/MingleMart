import { BadgeCheckIcon, QuoteIcon, RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/common/components/ui/avatar"
import { CountUp } from "@/common/components/animation/count-up"
import { Reveal, Stagger } from "@/common/components/animation/reveal"

const PROMISES = [
    {
        icon: TruckIcon,
        title: "Free shipping over $50",
        body: "Across every seller, with the threshold worked out on the discounted price.",
    },
    {
        icon: RotateCcwIcon,
        title: "Thirty days to change your mind",
        body: "Return postage is on us, on sale items as well as full price.",
    },
    {
        icon: ShieldCheckIcon,
        title: "Your money is held, not spent",
        body: "Payment reaches the seller once the parcel reaches you, and not before.",
    },
]

/**
 * The reason to bother creating an account, shown beside the form.
 *
 * Three specific promises rather than a stock photograph: someone hesitating
 * over a sign-up form is weighing whether this shop is safe to buy from, and
 * that is a question only concrete terms can answer.
 *
 * Hidden below `lg` — on a phone this would push the form itself off screen.
 */
export function AuthShowcase() {
    return (
        <div className="hidden lg:block">
            <Reveal
                as="span"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-sm backdrop-blur"
            >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                    <BadgeCheckIcon aria-hidden="true" className="size-3.5" />
                    Verified
                </span>
                <span className="text-muted-foreground">
                    <CountUp to={2400} suffix="+" /> independent sellers
                </span>
            </Reveal>

            <Reveal
                delay={80}
                as="h2"
                className="mt-6 max-w-md font-heading text-4xl font-extrabold tracking-tight text-balance"
            >
                One account.{" "}
                <span className="bg-[linear-gradient(100deg,var(--brand-2),var(--brand-3))] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-foreground">
                    Every shop
                </span>{" "}
                worth buying from.
            </Reveal>

            <Stagger as="ul" step={70} delay={160} className="mt-10 flex max-w-md flex-col gap-6">
                {PROMISES.map(({ icon: Icon, title, body }) => (
                    <li key={title} className="flex gap-4">
                        <span
                            aria-hidden="true"
                            className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                        >
                            <Icon className="size-5" />
                        </span>
                        <span>
                            <span className="block font-semibold">{title}</span>
                            <span className="mt-0.5 block text-sm text-pretty text-muted-foreground">
                                {body}
                            </span>
                        </span>
                    </li>
                ))}
            </Stagger>

            <Reveal
                delay={420}
                as="figure"
                className="mt-10 max-w-md rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur"
            >
                <QuoteIcon aria-hidden="true" className="size-6 text-primary/40" />
                <blockquote className="mt-3 text-pretty">
                    Checkout took about twenty seconds. No account wall, no six-page form, no
                    surprise fees at the end.
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                    <Avatar className="size-9">
                        <AvatarFallback className="text-xs font-semibold">LK</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                        <span className="block font-semibold">Lena K.</span>
                        <span className="block text-muted-foreground">Shopping since 2024</span>
                    </span>
                </figcaption>
            </Reveal>
        </div>
    )
}
