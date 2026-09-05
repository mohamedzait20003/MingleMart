import { type FC } from 'react';
import { LifeBuoyIcon } from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';

import { FaqList, type QuestionGroup } from '../components/faq-list';
import { PageCta } from '../components/page-cta';
import { PageHero } from '../components/page-hero';

const GROUPS: QuestionGroup[] = [
    {
        id: 'orders',
        title: 'Orders and payment',
        questions: [
            {
                q: 'When is my card actually charged?',
                a: 'At checkout, but the money is held rather than passed on. The seller is paid once the parcel is marked delivered, which is what makes a refund a reversal rather than a negotiation.',
            },
            {
                q: 'Can I change or cancel an order after placing it?',
                a: 'Until the seller marks it dispatched, yes, from the order page. After that it becomes a return, which is free either way.',
            },
            {
                q: 'Why is my order split into several parcels?',
                a: 'Each seller ships their own items. An order from three shops arrives as three parcels, on three tracking numbers, usually on different days.',
            },
            {
                q: 'Is the price on the product page the price I pay?',
                a: 'Yes. Shipping and tax are shown before checkout, not added at it. If the total moves between the basket and the card, that is a bug and we want to hear about it.',
            },
        ],
    },
    {
        id: 'delivery',
        title: 'Delivery',
        questions: [
            {
                q: 'How long does delivery take?',
                a: 'Most sellers dispatch within two working days, and most parcels arrive within five. The seller profile shows their own average, measured rather than promised.',
            },
            {
                q: 'When is shipping free?',
                a: 'On every order over $50, across all sellers. Below that the cost is shown per seller in the basket, before you reach checkout.',
            },
            {
                q: 'My tracking has not moved in days.',
                a: 'Give it one more working day, then open the order and use "Something is wrong". That routes to a person who can chase the carrier or refund you without waiting for the seller.',
            },
        ],
    },
    {
        id: 'returns',
        title: 'Returns and refunds',
        questions: [
            {
                q: 'What can I send back, and by when?',
                a: 'Anything unused, within thirty days of it arriving, sale items included. Perishables and made-to-order pieces are the exceptions, and both say so on the product page.',
            },
            {
                q: 'Who pays for return postage?',
                a: 'We do. Print the label from the order page and drop the parcel off. There is no restocking fee and no charge deducted from the refund.',
            },
            {
                q: 'How long does a refund take?',
                a: 'It is issued the day the return is scanned by the carrier, not the day the seller opens it. Your bank then takes its own three to five working days.',
            },
        ],
    },
    {
        id: 'account',
        title: 'Your account',
        questions: [
            {
                q: 'Do I need an account to buy something?',
                a: 'No. Guest checkout asks for an email and a delivery address, and nothing else. An account is only worth it if you want order history and saved addresses.',
            },
            {
                q: 'How do I delete my account and my data?',
                a: 'From Profile, under Privacy. Deletion is immediate for everything except the order records tax law requires us to keep, which the privacy policy sets out in full.',
            },
            {
                q: 'Someone has used my email to sign up.',
                a: 'An account is not usable until the address is verified, so an unverified signup cannot see or do anything. Tell support and we will release the address.',
            },
        ],
    },
];

const Faqs: FC = () => (
    <>
        <PageHero
            eyebrow="Help"
            title="Questions people actually ask"
            crumb="FAQs"
            description="The forty or so questions support answers most often, written out once. If yours is not here, a person will answer it."
            tone="cool"
            meta={
                <span className="inline-flex items-center gap-2">
                    <LifeBuoyIcon aria-hidden="true" className="size-4 text-success" />
                    Support replies in under four minutes
                </span>
            }
        />

        <FaqList groups={GROUPS} />

        <PageCta
            title="Still stuck?"
            description="Support is staffed around the clock by people who can change an order, not read a script back to you."
            to={navUrls.common.support}
            label="Contact support"
        />
    </>
);

export default Faqs;
