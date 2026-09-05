import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/common/components/ui/accordion"
import { Section } from "@/common/components/main/section"
import { Reveal } from "@/common/components/animation/reveal"

export interface QuestionGroup {
    id: string
    title: string
    questions: { q: string; a: string }[]
}

/**
 * Questions, grouped by the moment they get asked.
 *
 * Grouped rather than one long list because the reader arrives with a stage in
 * mind - mid-order, waiting on a parcel, sending something back - and scanning
 * six headings beats scanning forty questions.
 *
 * Each group is its own accordion so answers open independently; a single
 * accordion across the page would close the answer someone was still reading.
 */
export function FaqList({ groups }: Readonly<{ groups: QuestionGroup[] }>) {
    return (
        <Section>
            <div className="mx-auto flex max-w-3xl flex-col gap-12">
                {groups.map((group) => (
                    <Reveal key={group.id} as="section" id={group.id} className="scroll-mt-24">
                        <h2 className="mb-4 font-heading text-2xl font-extrabold tracking-tight text-balance">
                            {group.title}
                        </h2>

                        <Accordion className="border-t border-border">
                            {group.questions.map(({ q, a }) => (
                                <AccordionItem key={q} value={q}>
                                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                        {q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-pretty text-muted-foreground">
                                        {a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Reveal>
                ))}
            </div>
        </Section>
    )
}
