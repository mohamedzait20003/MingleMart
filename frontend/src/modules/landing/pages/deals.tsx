import { type FC } from 'react';

import { DealsView } from '@/common/components/deals/deals-view';

import { Newsletter } from '../components/newsletter';

/** Visitor-facing deals page. Product links resolve against the site root. */
const LDeals: FC = () => (
    <>
        <DealsView />
        <Newsletter />
    </>
);

export default LDeals;
