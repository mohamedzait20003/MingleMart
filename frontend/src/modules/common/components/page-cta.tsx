import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"

import { Magnetic } from "@/common/components/animation/magnetic"
import { Reveal } from "@/common/components/animation/reveal"
import { Shine } from "@/common/components/animation/shine"
import { Section } from "@/common/components/main/section"

type PageCtaProps = {
    title: string
    description: string
    /**
     * Path-relative target, e.g. "../careers". Relative because these pages are
     * mounted at three different prefixes; see `PageHero`.
     */
    to: string
    label: string
}

/**
 * Closing band for a company page.
 *
 * Same gradient and shape as the landing newsletter so the bottom of every page
 * on the site resolves the same way. One action only — a second link here just
 * splits the attention of someone who already read to the end.
 */
export function PageCta({ title, description, to, label }: Readonly<PageCtaProps>) {
    return (
        <Section>
            <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-2 to-brand-3 px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
                <div
                    aria-hidden="true"
                    data-float=""
                    style={{ "--float-duration": "12s", "--float-distance": "-16px" }}
                    className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-primary-foreground/15 blur-3xl"
                />

                <div className="relative mx-auto max-w-2xl text-primary-foreground">
                    <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                        {title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-pretty text-primary-foreground/85">
                        {description}
                    </p>

                    <Magnetic className="mt-8">
                        <Link
                            to={to}
                            relative="path"
                            data-shine-host=""
                            className="relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-foreground px-7 font-semibold text-primary transition-colors outline-none hover:bg-primary-foreground/90 focus-visible:ring-3 focus-visible:ring-primary-foreground/50"
                        >
                            {label}
                            <ArrowRightIcon aria-hidden="true" className="size-5" />
                            <Shine mode="hover" className="text-primary/25" duration={1.4} />
                        </Link>
                    </Magnetic>
                </div>
            </Reveal>
        </Section>
    )
}
