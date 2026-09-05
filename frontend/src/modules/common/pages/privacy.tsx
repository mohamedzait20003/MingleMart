import { type FC } from 'react';
import { ShieldCheckIcon } from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { LegalDocument } from '../components/legal-document';
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from '../components/privacy-content';

const Privacy: FC = () => (
    <>
        <PageHero
            eyebrow="Legal"
            title="Privacy policy"
            description="What we record about you, why we need it, who else sees it, and how to make us delete it. Each section opens with the same thing said plainly."
            tone="cool"
            meta={
                <span className="inline-flex items-center gap-2">
                    <ShieldCheckIcon aria-hidden="true" className="size-4 text-success" />
                    Last updated {PRIVACY_UPDATED}
                </span>
            }
        />

        <LegalDocument sections={PRIVACY_SECTIONS} />

        <PageCta
            title="Something here not clear?"
            description="Ask us. Privacy questions go to a person, not a form, and they are answered in plain language."
            to={navUrls.common.about}
            label="More about how we work"
        />
    </>
);

export default Privacy;
