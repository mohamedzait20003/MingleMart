import { type FC } from 'react';
import { AccessibilityIcon } from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { ACCESSIBILITY_SECTIONS, ACCESSIBILITY_UPDATED } from '../components/accessibility-content';
import { LegalDocument } from '../components/legal-document';
import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';

const Accessibility: FC = () => (
    <>
        <PageHero
            eyebrow="Accessibility"
            title="Accessibility statement"
            crumb="Accessibility"
            description="What we support today, the three places we know we fall short, and how to tell us when we are wrong about either. Each section opens with the same thing said plainly."
            tone="cool"
            meta={
                <span className="inline-flex items-center gap-2">
                    <AccessibilityIcon aria-hidden="true" className="size-4 text-success" />
                    WCAG 2.2 AA — last reviewed {ACCESSIBILITY_UPDATED}
                </span>
            }
        />

        <LegalDocument sections={ACCESSIBILITY_SECTIONS} />

        <PageCta
            title="Found a barrier?"
            description="Tell support, or write to accessibility@minglemart.example. Every report is acknowledged within two working days."
            to={navUrls.common.support}
            label="Contact support"
        />
    </>
);

export default Accessibility;
