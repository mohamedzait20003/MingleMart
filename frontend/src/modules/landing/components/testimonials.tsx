import { QuoteIcon, StarIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/common/components/ui/avatar"
import { Card, CardContent } from "@/common/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/common/components/ui/carousel"
import { Reveal } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "@/common/components/main/section"

const REVIEWS = [
    {
        name: "Amina Y.",
        role: "Shopping since 2023",
        rating: 5,
        quote: "Ordered on a Tuesday, wearing it on a Thursday. The return I did send back was refunded before the parcel even arrived.",
    },
    {
        name: "Tomas R.",
        role: "48 orders",
        rating: 5,
        quote: "I mostly buy from small sellers here. Every one of them has been responsive, and the packaging is never wasteful.",
    },
    {
        name: "Priya N.",
        role: "Shopping since 2021",
        rating: 4,
        quote: "The price-match promise is real. They refunded the difference on a lamp two days after I bought it, without me asking.",
    },
    {
        name: "Daniel O.",
        role: "12 orders",
        rating: 5,
        quote: "Support answered at 11pm on a Sunday and actually solved the problem. That never happens anywhere else.",
    },
    {
        name: "Lena K.",
        role: "Shopping since 2024",
        rating: 5,
        quote: "Checkout took about twenty seconds. No account wall, no six-page form, no surprise fees at the end.",
    },
]

const initials = (name: string) =>
    name
        .split(" ")
        .map((part) => part[0])
        .join("")

export function Testimonials() {
    return (
        <Section className="bg-muted/40">
            <SectionHeading
                eyebrow="Social proof"
                title="Shoppers keep coming back"
                description="A 4.9 average across more than eleven thousand verified reviews."
            />

            <Reveal>
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent className="-ml-4">
                        {REVIEWS.map((review) => (
                            <CarouselItem
                                key={review.name}
                                className="pl-4 sm:basis-1/2 lg:basis-1/3"
                            >
                                <Card className="h-full">
                                    <CardContent className="flex h-full flex-col gap-4 px-5">
                                        <QuoteIcon
                                            aria-hidden="true"
                                            className="size-7 shrink-0 text-primary/30"
                                        />

                                        <div className="flex items-center gap-1">
                                            <span className="flex text-warning">
                                                {[0, 1, 2, 3, 4].map((index) => (
                                                    <StarIcon
                                                        key={index}
                                                        aria-hidden="true"
                                                        className={
                                                            index < review.rating
                                                                ? "size-4 fill-current"
                                                                : "size-4 opacity-25"
                                                        }
                                                    />
                                                ))}
                                            </span>
                                            <span className="sr-only">
                                                Rated {review.rating} out of 5
                                            </span>
                                        </div>

                                        <blockquote className="flex-1 text-base text-pretty">
                                            {review.quote}
                                        </blockquote>

                                        <figcaption className="flex items-center gap-3 border-t border-border pt-4">
                                            <Avatar>
                                                <AvatarFallback className="bg-primary/12 font-semibold text-primary">
                                                    {initials(review.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>
                                                <span className="block text-sm font-semibold">
                                                    {review.name}
                                                </span>
                                                <span className="block text-xs text-muted-foreground">
                                                    {review.role}
                                                </span>
                                            </span>
                                        </figcaption>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Arrows sit inside the container on small screens so they never
                        push the carousel off the viewport edge. */}
                    <CarouselPrevious className="-left-3 size-11 sm:-left-5" />
                    <CarouselNext className="-right-3 size-11 sm:-right-5" />
                </Carousel>
            </Reveal>
        </Section>
    )
}
