import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { MdEdit, MdSave, MdCancel } from 'react-icons/md';

import type { RootState } from '../../../store';

const AccountRights: FC = () => {
    // Flags live under `customerProfile`, which is undefined until
    // GET /api/profile resolves; fall back to the server's own defaults.
    const { isActivityTracked = false, isDataShared = false } =
        useSelector((state: RootState) => state.user.customerProfile) ?? {};

    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
        activityTracking: isActivityTracked ?? true,
        dataSharing: isDataShared ?? false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        if (isEditing) {
            setSettings({ ...settings, [key]: !settings[key] });
        }
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSettings({
            activityTracking: isActivityTracked ?? true,
            dataSharing: isDataShared ?? false,
        });
        setIsEditing(false);
    };

    return (
        <section id="account-rights" className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Privacy</h2>
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
                Control your account privacy settings and how your information is used.
            </p>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.activityTracking}
                            onChange={() => handleToggle('activityTracking')}
                            disabled={!isEditing}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                        <span>
                            <span className="block font-medium text-gray-900">Activity Tracking</span>
                            <span className="block text-sm text-gray-600">Allow tracking of your activity for personalization</span>
                        </span>
                    </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={settings.dataSharing}
                            onChange={() => handleToggle('dataSharing')}
                            disabled={!isEditing}
                            className="peer sr-only"
                        />
                        <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                        <span>
                            <span className="block font-medium text-gray-900">Third-Party Data Sharing</span>
                            <span className="block text-sm text-gray-600">Allow sharing data with trusted partners</span>
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

export default AccountRights;