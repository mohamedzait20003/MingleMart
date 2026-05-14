import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Edit, Save, Cancel } from '@mui/icons-material';
import { FormControlLabel, Switch, Button, IconButton } from '@mui/material';

import type { RootState } from '../../../store';

const AccountRights: FC = () => {
    const { isActivityTracked, isDataShared } = useSelector((state: RootState) => state.user);

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
                    <IconButton
                        color="primary"
                        size="small"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                )}
            </div>
            <p className="text-sm text-gray-600 mb-6">
                Control your account privacy settings and how your information is used.
            </p>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.activityTracking}
                                onChange={() => handleToggle('activityTracking')}
                                disabled={!isEditing}
                            />
                        }
                        label={
                            <div>
                                <div className="font-medium text-gray-900">Activity Tracking</div>
                                <div className="text-sm text-gray-600">Allow tracking of your activity for personalization</div>
                            </div>
                        }
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.dataSharing}
                                onChange={() => handleToggle('dataSharing')}
                                disabled={!isEditing}
                            />
                        }
                        label={
                            <div>
                                <div className="font-medium text-gray-900">Third-Party Data Sharing</div>
                                <div className="text-sm text-gray-600">Allow sharing data with trusted partners</div>
                            </div>
                        }
                    />
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-4">
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        size="small"
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        size="small"
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </section>
    );
};

export default AccountRights;