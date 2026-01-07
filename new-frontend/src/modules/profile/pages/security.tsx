import { type FC } from 'react';

import ChangePassword from '../components/ChangePassword';
import TwoFactorAuth from '../components/TwoFactorAuth';
import ActiveSessions from '../components/ActiveSessions';

const Security: FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h1>
            <div className="space-y-8">
                <ChangePassword />
                <TwoFactorAuth />
                <ActiveSessions />
            </div>
        </div>
    );
};

export default Security;