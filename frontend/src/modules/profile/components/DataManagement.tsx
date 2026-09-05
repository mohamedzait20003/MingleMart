import { type FC } from 'react';

import { MdDownload, MdDeleteForever } from 'react-icons/md';

const DataManagement: FC = () => {
    const handleDownloadData = () => {
        console.log('Downloading user data...');
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );
        if (confirmed) {
            console.log('Account deletion requested...');
        }
    };

    return (
        <section id="data-management" className="pb-8 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
            <p className="text-sm text-gray-600 mb-6">
                Manage your data and exercise your privacy rights in accordance with GDPR and other data protection regulations.
            </p>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">Download Your Data</h3>
                            <p className="text-sm text-gray-600">
                                Get a copy of all your personal data stored in our system including profile information, activity logs, and preferences.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleDownloadData}
                            className="ml-4 inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdDownload />
                            Download
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
                            <p className="text-sm text-red-700">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            className="ml-4 inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <MdDeleteForever />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DataManagement;