import { type FC } from 'react';

import { BenefitsMarquee } from '../components/benefits-marquee';
import { Categories } from '../components/categories';
import { DealOfTheDay } from '../components/deal-of-the-day';
import { Faq } from '../components/faq';
import { Hero } from '../components/hero';
import { Newsletter } from '../components/newsletter';
import { Testimonials } from '../components/testimonials';
import { Trending } from '../components/trending';

/**
 * Marketplace landing order: search first, reassurance, then the catalogue,
 * one urgent offer, social proof, objections, and finally the ask. Social proof
 * deliberately sits before the last call to action rather than after it.
 */
const LHome: FC = () => (
    <>
        <Hero />
        <BenefitsMarquee />
        <Categories />
        <Trending />
        <DealOfTheDay />
        <Testimonials />
        <Faq />
        <Newsletter />
    </>
);

export default LHome;
