import { useState, type FormEvent } from "react"
import { CheckCircle2Icon, MailIcon } from "lucide-react"

import { Input } from "@/common/components/ui/input"
import { Reveal } from "@/common/components/animation/reveal"
import { Section } from "@/common/components/main/section"

export function Newsletter() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "done">("idle")

    // No subscription endpoint exists yet, so this confirms locally rather than
    // pretending to have sent something. Swap in the mutation when it lands.
    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        if (!email.trim()) return
        setStatus("done")
    }

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
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
                        <MailIcon aria-hidden="true" className="size-7" />
                    </span>

                    <h2 className="mt-6 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                        Get the good stuff first
                    </h2>
                    <p className="mx-auto mt-3 max-w-lg text-pretty text-primary-foreground/85">
                        One email a week: the drops worth knowing about and the discounts worth
                        using. Nothing else.
                    </p>

                    {status === "done" ? (
                        <p
                            role="status"
                            className="mx-auto mt-8 inline-flex items-center gap-2.5 rounded-xl bg-primary-foreground/15 px-5 py-3.5 font-semibold backdrop-blur"
                        >
                            <CheckCircle2Icon aria-hidden="true" className="size-5" />
                            You are on the list. Check your inbox to confirm.
                        </p>
                    ) : (
                        <form
                            onSubmit={onSubmit}
                            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                        >
                            <div className="flex-1 text-left">
                                <label htmlFor="newsletter-email" className="sr-only">
                                    Email address
                                </label>
                                <Input
                                    id="newsletter-email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="you@example.com"
                                    className="h-12 rounded-xl border-primary-foreground/35 bg-primary-foreground/10 text-base text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/30"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl bg-primary-foreground px-6 font-semibold text-primary transition-colors outline-none hover:bg-primary-foreground/90 focus-visible:ring-3 focus-visible:ring-primary-foreground/50"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}

                    <p className="mt-4 text-sm text-primary-foreground/70">
                        Unsubscribe in one click. We never sell your address.
                    </p>
                </div>
            </Reveal>
        </Section>
    )
}
