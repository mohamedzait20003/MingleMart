import { type FC } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Person, Security, Lock, LocalShipping, CreditCard, AccountCircle, Badge, Settings, VpnKey, Shield, Devices, Storage, VerifiedUser, Notifications } from '@mui/icons-material';

import type { RootState } from '../../store';

const Profile: FC = () => {
    const { role } = useSelector((state: RootState) => state.auth);
    const isCustomer = role === 'Customer';
    const location = useLocation();

    const isSubItemActive = (path: string) => location.pathname === path;
    const isParentActive = (subItems: any[]) => subItems.some(sub => location.pathname === sub.path);

    const profileInfoSubItems = [
        { path: '/profile#picture', label: 'Profile Picture', icon: AccountCircle },
        { path: '/profile#personal', label: 'Personal Info', icon: Person },
        { path: '/profile#account', label: 'Account Info', icon: Badge },
        { path: '/profile#preferences', label: 'Preferences', icon: Settings },
    ];

    const securitySubItems = [
        { path: '/profile/security#change-password', label: 'Change Password', icon: VpnKey },
        { path: '/profile/security#two-factor', label: 'Two-Factor Auth', icon: Shield },
        { path: '/profile/security#active-sessions', label: 'Active Sessions', icon: Devices },
    ];

    const privacySubItems = [
        { path: '/profile/privacy#data-management', label: 'Data Management', icon: Storage },
        { path: '/profile/privacy#account-rights', label: 'Account Privacy', icon: VerifiedUser },
        { path: '/profile/privacy#notification-settings', label: 'Notifications', icon: Notifications },
    ];

    const menuItems = [
        {
            key: 'profile-information',
            path: '/profile',
            label: 'Profile Information',
            icon: Person,
            subItems: profileInfoSubItems
        },
        {
            key: 'security',
            path: '/profile/security',
            label: 'Security Settings',
            icon: Security,
            subItems: securitySubItems
        },
        {
            key: 'privacy',
            path: '/profile/privacy',
            label: 'Privacy Settings',
            icon: Lock,
            subItems: privacySubItems
        },
        ...(isCustomer ? [
            { key: 'shipping', path: '/profile/shipping', label: 'Shipping Settings', icon: LocalShipping },
            { key: 'billing', path: '/profile/billing', label: 'Billing Settings', icon: CreditCard },
        ] : [])
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-80 shrink-0">
                    <nav className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-6 bg-linear-to-r from-blue-600 to-blue-700 text-white">
                            <h2 className="text-xl font-bold">Account Settings</h2>
                        </div>
                        <ul className="py-3">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const hasSubItems = 'subItems' in item && item.subItems;
                                const isActive = hasSubItems
                                    ? isParentActive(item.subItems)
                                    : location.pathname === item.path;

                                return (
                                    <li key={item.key}>
                                        {hasSubItems ? (
                                            <>
                                                <NavLink
                                                    to={item.path}
                                                    className={`w-full flex items-center gap-4 px-6 py-4 transition-colors duration-150 ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                    }`}
                                                >
                                                    <Icon fontSize="medium" />
                                                    <span className="text-base">{item.label}</span>
                                                </NavLink>
                                                <ul className="bg-gray-50">
                                                    {item.subItems.map((subItem) => {
                                                        const SubIcon = subItem.icon;
                                                        const subActive = isSubItemActive(subItem.path);
                                                        return (
                                                            <li key={subItem.path}>
                                                                <NavLink
                                                                    to={subItem.path}
                                                                    className={`flex items-center gap-3 pl-16 pr-6 py-3 transition-colors duration-150 ${
                                                                        subActive
                                                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                                                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                                                                    }`}
                                                                >
                                                                    <SubIcon fontSize="small" />
                                                                    <span className="text-sm">{subItem.label}</span>
                                                                </NavLink>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </>
                                        ) : (
                                            <NavLink
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-4 px-6 py-4 transition-colors duration-150 ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                    }`
                                                }
                                            >
                                                <Icon fontSize="medium" />
                                                <span className="text-base">{item.label}</span>
                                            </NavLink>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Profile;