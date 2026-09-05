import { type FC } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRightIcon,
    BadgeCheckIcon,
    HeadsetIcon,
    ReceiptTextIcon,
    ShieldCheckIcon,
    StoreIcon,
} from 'lucide-react';

import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { FeatureGrid, type Feature } from '../components/feature-grid';
import { StatsBand, type Stat } from '../components/stats-band';
import { StoryTimeline, type Milestone } from '../components/story-timeline';

const VALUES: Feature[] = [
    {
        icon: StoreIcon,
        title: 'Sellers come first',
        body: 'Independent shops keep 94% of what they sell. No paid placement, no buying your way to the top of a search.',
        tone: 2,
    },
    {
        icon: ReceiptTextIcon,
        title: 'The price is the price',
        body: 'Shipping and tax are shown before checkout, not after it. What the product page says is what the card is charged.',
        tone: 5,
    },
    {
        icon: ShieldCheckIcon,
        title: 'Your money is held, not spent',
        body: 'Payment sits with us until the parcel arrives. If it never does, the refund does not need a negotiation.',
        tone: 3,
    },
    {
        icon: HeadsetIcon,
        title: 'A person answers',
        body: 'Support is staffed around the clock by people who can actually change an order, not read a script back to you.',
        tone: 1,
    },
];

const STATS: Stat[] = [
    { value: 51000, suffix: '+', label: 'Shoppers served' },
    { value: 2400, suffix: '+', label: 'Independent sellers' },
    { value: 4.9, decimals: 1, label: 'Average review score' },
    { value: 94, suffix: '%', label: 'Of each sale kept by the seller' },
];

const MILESTONES: Milestone[] = [
    {
        year: '2021',
        title: 'Two shops and a spreadsheet',
        body: 'MingleMart started as a shared checkout for two market stalls who were tired of losing a third of every sale to fees. The catalogue lived in a spreadsheet for most of that first year.',
    },
    {
        year: '2023',
        title: 'Verification, and the fee cap',
        body: 'Every seller now passes identity and returns-policy checks before their first listing goes live. We capped our own cut at 6% the same quarter, and it has not moved since.',
    },
    {
        year: '2024',
        title: 'Free returns on everything',
        body: 'Return postage moved onto us, on full-price and sale items alike. Returns went up by a fifth; repeat orders went up by rather more than that.',
    },
    {
        year: '2026',
        title: 'Two and a half thousand shops',
        body: 'Now serving fifty-one thousand shoppers across six departments, with support answering in under four minutes at any hour of the day.',
    },
];

const About: FC = () => (
    <>
        <PageHero
            eyebrow="About us"
            title="A marketplace built around the people selling on it"
            crumb="About"
            description="We are a small team running a shop that is not ours. Two and a half thousand independent sellers list here, and our job is to make sure the price is honest, the parcel arrives, and the money reaches them."
            actions={
                <>
                    <Link
                        to="../careers"
                        relative="path"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        See open roles
                        <ArrowRightIcon aria-hidden="true" className="size-5" />
                    </Link>
                    {/* ".." rather than "../shop": these pages are also mounted under
                        /admin/:id, which has no shop route. The mount root is the
                        catalogue for a visitor and for a customer, and a valid page
                        for an admin. */}
                    <Link
                        to=".."
                        relative="path"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-6 font-semibold backdrop-blur transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40"
                    >
                        <BadgeCheckIcon aria-hidden="true" className="size-5 text-success" />
                        Browse the marketplace
                    </Link>
                </>
            }
        />

        <StatsBand stats={STATS} />

        <FeatureGrid
            eyebrow="What we hold to"
            title="Four promises, and what they cost us"
            description="Every one of these is a decision that made us less money in the quarter we made it."
            features={VALUES}
        />

        <StoryTimeline
            eyebrow="How we got here"
            title="Five years, four decisions"
            milestones={MILESTONES}
        />

        <PageCta
            title="We are hiring"
            description="Six open roles across engineering, design, and support — most of them remote, all of them permanent."
            to="../careers"
            label="View open positions"
        />
    </>
);

export default About;
