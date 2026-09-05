import { type FC } from 'react';
import { ScrollTextIcon } from 'lucide-react';

import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { LegalDocument } from '../components/legal-document';
import { TERMS_SECTIONS, TERMS_UPDATED } from '../components/terms-content';

const Terms: FC = () => (
    <>
        <PageHero
            eyebrow="Legal"
            title="Terms of service"
            description="What you agree to by shopping here, what we owe you in return, and what happens when an order goes wrong. Every section opens with the same thing in one sentence."
            tone="cool"
            meta={
                <span className="inline-flex items-center gap-2">
                    <ScrollTextIcon aria-hidden="true" className="size-4 text-info" />
                    Last updated {TERMS_UPDATED}
                </span>
            }
        />

        <LegalDocument sections={TERMS_SECTIONS} />

        <PageCta
            title="How we handle your data"
            description="The other half of the agreement: what we record, why, and how to have it deleted."
            to="../privacy"
            label="Read the privacy policy"
        />
    </>
);

export default Terms;
