import { type FC } from 'react';

import DataManagement from '../components/DataManagement';
import AccountRights from '../components/AccountRights';
import NotificationSettings from '../components/NotificationSettings';

const PPrivacy: FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h1>
            <div className="space-y-8">
                <DataManagement />
                <AccountRights />
                <NotificationSettings />
            </div>
        </div>
    );
};

export default PPrivacy;