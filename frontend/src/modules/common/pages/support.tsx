import { type FC } from 'react';
import {
    ClockIcon,
    MailIcon,
    MessagesSquareIcon,
    PackageSearchIcon,
    PhoneIcon,
    RotateCcwIcon,
} from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { FeatureGrid, type Feature } from '../components/feature-grid';
import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';
import { StatsBand, type Stat } from '../components/stats-band';

const CHANNELS: Feature[] = [
    {
        icon: MessagesSquareIcon,
        title: 'Live chat, any hour',
        body: 'The fastest route, and the only one that can change an order in flight. Open it from any page once you are signed in.',
        tone: 2,
    },
    {
        icon: MailIcon,
        title: 'Email us',
        body: 'help@minglemart.example for anything that needs an attachment or a paper trail. Answered in under four hours, including weekends.',
        tone: 5,
    },
    {
        icon: PhoneIcon,
        title: 'Call us',
        body: 'Freephone on 0800 960 0960, 8am to 10pm. No menu tree and no hold music budget - it rings at a desk.',
        tone: 3,
    },
];

const COMMON: Feature[] = [
    {
        icon: PackageSearchIcon,
        title: 'Where is my parcel?',
        body: 'Tracking lives on the order page. If it has not moved in two working days, "Something is wrong" skips the seller and reaches us.',
        tone: 1,
    },
    {
        icon: RotateCcwIcon,
        title: 'I need to send something back',
        body: 'Thirty days, sale items included, return postage on us. The label prints from the order page and no reason is required.',
        tone: 4,
    },
    {
        icon: ClockIcon,
        title: 'My refund has not arrived',
        body: 'We issue it the day the carrier scans your return. After that it is your bank, which takes three to five working days.',
        tone: 3,
    },
];

const RESPONSE: Stat[] = [
    { value: 4, suffix: ' min', label: 'Median chat wait' },
    { value: 4, suffix: ' hrs', label: 'Median email reply' },
    { value: 92, suffix: '%', label: 'Solved on first contact' },
    { value: 24, suffix: '/7', label: 'Chat and email staffed' },
];

const Support: FC = () => (
    <>
        <PageHero
            eyebrow="Support"
            title="A person answers, at any hour"
            crumb="Support"
            description="Three ways to reach us, all of them staffed by people who can change an order, issue a refund, or chase a carrier without escalating first."
            tone="brand"
        />

        <StatsBand stats={RESPONSE} />

        <FeatureGrid
            eyebrow="Reach us"
            title="Pick whichever suits the problem"
            description="Chat is fastest. Email is best when something needs to be attached. The phone is a real phone."
            features={CHANNELS}
            columns={3}
        />

        <FeatureGrid
            eyebrow="Before you write in"
            title="The three we are asked most"
            description="Each of these can be settled from your order page in less time than a conversation takes."
            features={COMMON}
            columns={3}
            className="bg-muted/40"
        />

        <PageCta
            title="Looking for a quick answer?"
            description="The forty questions support fields most often, written out in full and grouped by what you are in the middle of."
            to={navUrls.common.faqs}
            label="Read the FAQs"
        />
    </>
);

export default Support;
