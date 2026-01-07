import { type FC } from 'react';

import { Button } from '@mui/material';
import { Download, DeleteForever } from '@mui/icons-material';

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
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={handleDownloadData}
                            className="ml-4"
                        >
                            Download
                        </Button>
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
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={handleDeleteAccount}
                            className="ml-4"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DataManagement;