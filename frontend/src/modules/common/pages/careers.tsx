import { type FC } from 'react';
import {
    ArrowDownIcon,
    BanknoteIcon,
    CalendarHeartIcon,
    GraduationCapIcon,
    HeartPulseIcon,
    LightbulbIcon,
    ScaleIcon,
    UsersRoundIcon,
} from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { FeatureGrid, type Feature } from '../components/feature-grid';
import { JobBoard, type Job } from '../components/job-board';
import { StatsBand, type Stat } from '../components/stats-band';

const BENEFITS: Feature[] = [
    {
        icon: BanknoteIcon,
        title: 'Published salary bands',
        body: 'Every band is on the job ad and the same for everyone at that level. We do not negotiate, so the best negotiator does not win.',
        tone: 5,
    },
    {
        icon: CalendarHeartIcon,
        title: 'Thirty days off, enforced',
        body: 'Thirty days plus public holidays, and a minimum of fifteen you have to take. Your manager is measured on whether you did.',
        tone: 1,
    },
    {
        icon: HeartPulseIcon,
        title: 'Health cover from day one',
        body: 'Medical, dental and mental-health cover with no waiting period, extended to a partner and children at no cost to you.',
        tone: 3,
    },
    {
        icon: GraduationCapIcon,
        title: 'A learning budget you keep',
        body: '£1,500 a year for courses, conferences or books, and it does not expire at the end of the quarter.',
        tone: 4,
    },
];

const CULTURE: Feature[] = [
    {
        icon: LightbulbIcon,
        title: 'Write it down',
        body: 'Decisions land in a document before they land in a meeting. It is slower on the day and much faster over a quarter.',
        tone: 2,
    },
    {
        icon: UsersRoundIcon,
        title: 'Small teams, whole problems',
        body: 'Four to six people who own a thing end to end — research, build, ship, and the support tickets that follow it.',
        tone: 5,
    },
    {
        icon: ScaleIcon,
        title: 'Disagree in the open',
        body: 'Objections belong in the thread, not the corridor. Once a call is made we commit to it, including the people who lost the argument.',
        tone: 1,
    },
];

const STATS: Stat[] = [
    { value: 68, label: 'People, across nine countries' },
    { value: 4, label: 'Day working week, fully paid' },
    { value: 92, suffix: '%', label: 'Would recommend us as a workplace' },
    { value: 3.4, decimals: 1, label: 'Average years on the team' },
];

const JOBS: Job[] = [
    {
        id: 'senior-full-stack',
        title: 'Senior Full-Stack Engineer',
        department: 'Engineering',
        location: 'Remote (UK / EU) or London',
        type: 'Permanent · £78k–£95k',
        summary:
            'Own a slice of the marketplace end to end — checkout, catalogue, or the seller tools behind them. You will be one of four engineers on a team that ships to production most days.',
        doing: [
            'Building customer-facing features in React and TypeScript, and the Spring services behind them.',
            'Making the calls on data models and API shape, then writing them down for the people who follow you.',
            'Sitting in on support escalations for your own surface, so the feedback loop stays short.',
        ],
    },
    {
        id: 'product-designer',
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote (UK / EU)',
        type: 'Permanent · £62k–£78k',
        summary:
            'Design the parts of the shop people actually touch: search, the product page, and checkout. You will work directly with two engineers rather than handing files across a wall.',
        doing: [
            'Taking a problem from customer interviews through to shipped interface, prototype included.',
            'Extending the design system rather than working around it, and pruning it when it grows a second way to do something.',
            'Running the accessibility pass on your own work — contrast, keyboard, and screen reader.',
        ],
    },
    {
        id: 'senior-product-manager',
        title: 'Senior Product Manager, Seller Tools',
        department: 'Product',
        location: 'London or remote (UK)',
        type: 'Permanent · £75k–£90k',
        summary:
            'The two and a half thousand shops listing with us are the half of the marketplace nobody sees. This role owns their side of it: listing, pricing, stock, and payouts.',
        doing: [
            'Talking to sellers weekly and turning what you hear into a roadmap other people can argue with.',
            'Deciding what not to build, and being able to say why in one paragraph.',
            'Owning the seller-retention number, quarter after quarter.',
        ],
    },
    {
        id: 'support-lead',
        title: 'Customer Support Lead',
        department: 'Support',
        location: 'Remote (UK / EU)',
        type: 'Permanent · £45k–£56k',
        summary:
            'Lead a team of nine answering shoppers and sellers around the clock. Our median first reply is under four minutes and we intend to keep it there as volume grows.',
        doing: [
            'Coaching a rota that covers every hour, without anyone working a schedule you would not.',
            'Turning repeat tickets into a bug report or a copy change, rather than a better macro.',
            'Holding the line on refunds when the policy is on the customer’s side.',
        ],
    },
    {
        id: 'data-analyst',
        title: 'Data Analyst',
        department: 'Product',
        location: 'Remote (UK / EU)',
        type: 'Permanent · £52k–£65k',
        summary:
            'Answer the questions that decide what we build next, and say plainly when the data cannot answer them. You will be the second analyst, so you get a say in how the whole practice works.',
        doing: [
            'Designing and reading experiments on search, pricing, and checkout.',
            'Building the models that sit behind the seller-payout and returns dashboards.',
            'Pushing back on a question when the honest answer is that the sample is too small.',
        ],
    },
    {
        id: 'platform-engineer',
        title: 'Platform Engineer',
        department: 'Engineering',
        location: 'Remote (UK / EU)',
        type: 'Permanent · £72k–£88k',
        summary:
            'Keep a marketplace that takes money online and quick. You will own deploys, observability, and the on-call rotation you are helping to make quieter.',
        doing: [
            'Running our deployment pipeline and cutting the time from merge to production.',
            'Owning alerting and the runbooks behind it, so a page at 3am is one somebody can act on.',
            'Making the boring capacity and cost decisions early, before they become interesting ones.',
        ],
    },
];

const Careers: FC = () => (
    <>
        <PageHero
            eyebrow="Careers"
            title="Come and build the honest end of e-commerce"
            crumb="Careers"
            description="Sixty-eight people across nine countries, a four-day week, and salary bands published on every ad. Six roles are open right now."
            tone="cool"
            actions={
                <a
                    href="#positions"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                    See the six open roles
                    <ArrowDownIcon aria-hidden="true" className="size-5" />
                </a>
            }
        />

        <StatsBand stats={STATS} />

        <FeatureGrid
            eyebrow="What you get"
            title="The terms, up front"
            description="The same list we send with every offer, published here so you can compare before you apply."
            features={BENEFITS}
        />

        <FeatureGrid
            eyebrow="How we work"
            title="Three habits we actually keep"
            description="Not aspirations. These are the ones you would notice in your first fortnight."
            features={CULTURE}
            columns={3}
            className="pt-0"
        />

        <JobBoard jobs={JOBS} />

        <PageCta
            title="Not sure you are what we asked for?"
            description="Neither were half the people here. If the work sounds like yours, tell us why — we would rather read that than a keyword match."
            to={navUrls.common.about}
            label="Read about how we got here"
        />
    </>
);

export default Careers;
