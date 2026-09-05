import { BriefcaseIcon, ClockIcon, MailIcon, MapPinIcon } from "lucide-react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/common/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs"
import { Reveal } from "@/common/components/animation/reveal"
import { Section, SectionHeading } from "@/common/components/main/section"

export interface Job {
    id: string
    title: string
    department: string
    location: string
    type: string
    summary: string
    /** Three or four concrete things the role actually does. */
    doing: string[]
}

/**
 * Placeholder inbox. Swap for the applicant-tracking link when one exists —
 * this is the only outward-facing address on the page.
 */
export const CAREERS_EMAIL = "careers@minglemart.com"

/** Matches the deals filter chips, so both pages filter the same way. */
const TAB_CLASS =
    "h-11! flex-none! gap-2 rounded-full px-4 text-sm font-semibold " +
    "shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-muted " +
    "data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none " +
    "dark:data-active:bg-primary! dark:data-active:text-primary-foreground!"

const META_CLASS = "inline-flex items-center gap-1.5 text-sm text-muted-foreground"

function JobList({ jobs }: Readonly<{ jobs: Job[] }>) {
    return (
        <Accordion className="w-full">
            {jobs.map(({ id, title, department, location, type, summary, doing }) => (
                <AccordionItem key={id} value={id}>
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                        <span className="flex flex-col gap-2">
                            <span className="font-heading text-lg font-bold text-balance">
                                {title}
                            </span>
                            <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                <span className={META_CLASS}>
                                    <BriefcaseIcon aria-hidden="true" className="size-4" />
                                    {department}
                                </span>
                                <span className={META_CLASS}>
                                    <MapPinIcon aria-hidden="true" className="size-4" />
                                    {location}
                                </span>
                                <span className={META_CLASS}>
                                    <ClockIcon aria-hidden="true" className="size-4" />
                                    {type}
                                </span>
                            </span>
                        </span>
                    </AccordionTrigger>

                    <AccordionContent className="pb-6">
                        <p className="max-w-3xl text-base text-pretty text-muted-foreground">
                            {summary}
                        </p>

                        <p className="mt-5 mb-2 text-sm font-semibold">What you would be doing</p>
                        <ul className="flex max-w-3xl flex-col gap-2">
                            {doing.map((item) => (
                                <li
                                    key={item}
                                    className="flex gap-2.5 text-pretty text-muted-foreground"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <a
                            href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
                                `Application: ${title}`
                            )}`}
                            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground no-underline! transition-colors outline-none hover:bg-primary/90 hover:text-primary-foreground! focus-visible:ring-3 focus-visible:ring-ring/40"
                        >
                            <MailIcon aria-hidden="true" className="size-4" />
                            Apply for this role
                        </a>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

/**
 * Open roles, filtered by department.
 *
 * Roles expand in place rather than opening a page, because there is nothing on
 * a job page a paragraph and four bullets cannot carry — and a list that stays
 * a list is a list you can compare across. Departments are derived from the
 * roles themselves, so a tab can never point at an empty panel.
 */
export function JobBoard({ jobs }: Readonly<{ jobs: Job[] }>) {
    const departments = ["All teams", ...new Set(jobs.map((job) => job.department))]

    return (
        <Section id="positions" className="scroll-mt-20 bg-muted/40">
            <SectionHeading
                eyebrow="Open roles"
                title={`${jobs.length} positions open right now`}
                description="Every role is permanent and salaried. Where a location is listed, it is where the team is — not a requirement to be there."
                align="start"
            />

            <Tabs defaultValue={departments[0]}>
                <TabsList className="h-auto! w-full flex-wrap justify-start gap-2 bg-transparent! p-0!">
                    {departments.map((department) => (
                        <TabsTrigger key={department} value={department} className={TAB_CLASS}>
                            {department}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {departments.map((department, index) => (
                    <TabsContent key={department} value={department} className="mt-8">
                        <JobList
                            jobs={
                                index === 0
                                    ? jobs
                                    : jobs.filter((job) => job.department === department)
                            }
                        />
                    </TabsContent>
                ))}
            </Tabs>

            <Reveal
                as="p"
                delay={100}
                className="mt-10 max-w-3xl text-sm text-pretty text-muted-foreground"
            >
                Nothing here that fits? Write to{" "}
                <a
                    href={`mailto:${CAREERS_EMAIL}`}
                    className="rounded-sm font-semibold text-primary underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    {CAREERS_EMAIL}
                </a>{" "}
                anyway. We read every one, and we have opened roles off the back of a good letter
                before.
            </Reveal>
        </Section>
    )
}
