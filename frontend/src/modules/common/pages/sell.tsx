import { type FC } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRightIcon,
    BadgeCheckIcon,
    CoinsIcon,
    MegaphoneIcon,
    ScaleIcon,
    TruckIcon,
    WalletIcon,
} from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { FeatureGrid, type Feature } from '../components/feature-grid';
import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { StatsBand, type Stat } from '../components/stats-band';
import { StoryTimeline, type Milestone } from '../components/story-timeline';

const TERMS: Stat[] = [
    { value: 6, suffix: '%', label: 'Our cut, capped since 2023' },
    { value: 94, suffix: '%', label: 'Of each sale you keep' },
    { value: 0, label: 'Listing fees, ever' },
    { value: 7, suffix: ' days', label: 'From sale to payout' },
];

const REASONS: Feature[] = [
    {
        icon: CoinsIcon,
        title: 'One fee, and it is capped',
        body: 'Six percent of the sale price. No listing fee, no monthly subscription, no charge for the photographs or the storefront.',
        tone: 5,
    },
    {
        icon: MegaphoneIcon,
        title: 'Nobody buys their way to the top',
        body: 'Search ranks on relevance and on your own delivery and returns record. There is no promoted placement to outbid you.',
        tone: 2,
    },
    {
        icon: WalletIcon,
        title: 'Paid on a schedule you can plan around',
        body: 'Payouts land seven days after delivery, every week, to your own account. No rolling reserve and no minimum balance.',
        tone: 3,
    },
    {
        icon: TruckIcon,
        title: 'Returns postage is ours',
        body: 'We fund free returns across the marketplace, including on your sale items. It costs us more and it sells you more.',
        tone: 1,
    },
    {
        icon: BadgeCheckIcon,
        title: 'Verified sellers only',
        body: 'Every shop passes identity and returns-policy checks before its first listing. It is slower to join, and worth more once you have.',
        tone: 4,
    },
    {
        icon: ScaleIcon,
        title: 'The rules are published',
        body: 'Ranking factors, fee changes and policy updates are announced before they take effect, never applied retroactively to live listings.',
        tone: 2,
    },
];

const STEPS: Milestone[] = [
    {
        year: 'Step 1',
        title: 'Open an account',
        body: 'The same account a shopper uses. Tell us you want to sell and the seller application appears in your profile.',
    },
    {
        year: 'Step 2',
        title: 'Pass verification',
        body: 'Identity, a bank account in the same name, and a returns policy that clears our minimum. Most applications are decided within two working days.',
    },
    {
        year: 'Step 3',
        title: 'List your first products',
        body: 'Photographs, a price and a dispatch window. Listings go live immediately; there is no queue and no editorial review.',
    },
    {
        year: 'Step 4',
        title: 'Get paid, weekly',
        body: 'Your first payout lands seven days after your first delivery, and every week after that. The dashboard shows what is held and what is cleared.',
    },
];

const Sell: FC = () => (
    <>
        <PageHero
            eyebrow="For sellers"
            title="Sell on MingleMart"
            crumb="Sell"
            description="Two and a half thousand independent shops list here. Six percent, capped, no listing fees, and a search that cannot be bought."
            actions={
                <>
                    <Link
                        to={navUrls.auth.signUp}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        Start an application
                        <ArrowRightIcon aria-hidden="true" className="size-5" />
                    </Link>
                    <Link
                        to={navUrls.common.faqs}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 font-semibold backdrop-blur transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        Read the FAQs
                    </Link>
                </>
            }
        />

        <StatsBand stats={TERMS} />

        <FeatureGrid
            eyebrow="Why here"
            title="Six things we will not change on you"
            description="Each one is a decision that made us less money in the quarter we made it."
            features={REASONS}
        />

        <StoryTimeline
            eyebrow="Getting started"
            title="Four steps, about a week"
            milestones={STEPS}
        />

        <PageCta
            title="Ready to list?"
            description="Applications are decided within two working days, and there is nothing to pay until something sells."
            to={navUrls.auth.signUp}
            label="Create your seller account"
        />
    </>
);

export default Sell;
