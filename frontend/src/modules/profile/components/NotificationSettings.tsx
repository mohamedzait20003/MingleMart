import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { MdEdit, MdSave, MdCancel } from 'react-icons/md';

import type { RootState } from '../../../store';

const NotificationSettings: FC = () => {
    const {
        isEmailNotified = true,
        isSecurityNotified = true,
        isUpdateNotified = true,
    } = useSelector((state: RootState) => state.user.customerProfile) ?? {};

    
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
        emailNotifications: isEmailNotified ?? true,
        securityAlerts: isSecurityNotified ?? true,
        accountUpdates: isUpdateNotified ?? true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        if (isEditing) {
            setSettings({ ...settings, [key]: !settings[key] });
        }
    };

    const handleSave = () => {
        // Handle save logic
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSettings({
            emailNotifications: isEmailNotified ?? true,
            securityAlerts: isSecurityNotified ?? true,
            accountUpdates: isUpdateNotified ?? true,
        });
        setIsEditing(false);
    };

    return (
        <section id="notification-settings" className="pb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                {!isEditing && (
                    <button
                        type="button"
                        aria-label="Edit section"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full p-2 text-blue-600 transition hover:bg-blue-50"
                    >
                            <MdEdit />
                    </button>
                )}
            </div>
            <p className="text-sm text-gray-600 mb-6">
                Choose how and when you want to receive notifications.
            </p>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle('emailNotifications')}
                            disabled={!isEditing}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                        <span>
                            <span className="block font-medium text-gray-900">Email Notifications</span>
                            <span className="block text-sm text-gray-600">Receive notifications via email</span>
                        </span>
                    </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.securityAlerts}
                            onChange={() => handleToggle('securityAlerts')}
                            disabled={!isEditing}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                        <span>
                            <span className="block font-medium text-gray-900">Security Alerts</span>
                            <span className="block text-sm text-gray-600">Get notified about security-related activities</span>
                        </span>
                    </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.accountUpdates}
                            onChange={() => handleToggle('accountUpdates')}
                            disabled={!isEditing}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                        <span>
                            <span className="block font-medium text-gray-900">Account Updates</span>
                            <span className="block text-sm text-gray-600">Receive updates about your account changes</span>
                        </span>
                    </label>
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                        <MdSave />
                        Save
                    </button>
                    <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                        <MdCancel />
                        Cancel
                    </button>
                </div>
            )}
        </section>
    );
};

export default NotificationSettings;