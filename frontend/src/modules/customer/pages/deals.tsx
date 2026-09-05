import { type FC } from 'react';
import { useParams } from 'react-router-dom';

import { DealsView } from '@/common/components/deals/deals-view';

const CDeals: FC = () => {
    const { publicUserId } = useParams();

    return <DealsView basePath={`/user/${publicUserId}`} />;
};

export default CDeals;
