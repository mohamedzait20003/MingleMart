import { type FC } from 'react';

import ProfilePicture from '../components/ProfilePicture';
import PersonalInformation from '../components/PersonalInformation';
import AccountInformation from '../components/AccountInformation';
import Preferences from '../components/Preferences';

const Information: FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h1>
            <div className="space-y-8">
                <ProfilePicture />
                <PersonalInformation />
                <AccountInformation />
                <Preferences />
            </div>
        </div>
    );
};

export default Information;