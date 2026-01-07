import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Edit, Save, Cancel } from '@mui/icons-material';
import { FormControlLabel, Switch, Button, IconButton } from '@mui/material';

import type { RootState } from '../../../store';

const NotificationSettings: FC = () => {
    const { isEmailNotified, isSecurityNotified, isUpdateNotified } = useSelector((state: RootState) => state.user);

    
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
                Choose how and when you want to receive notifications.
            </p>

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.emailNotifications}
                                onChange={() => handleToggle('emailNotifications')}
                                disabled={!isEditing}
                            />
                        }
                        label={
                            <div>
                                <div className="font-medium text-gray-900">Email Notifications</div>
                                <div className="text-sm text-gray-600">Receive notifications via email</div>
                            </div>
                        }
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.securityAlerts}
                                onChange={() => handleToggle('securityAlerts')}
                                disabled={!isEditing}
                            />
                        }
                        label={
                            <div>
                                <div className="font-medium text-gray-900">Security Alerts</div>
                                <div className="text-sm text-gray-600">Get notified about security-related activities</div>
                            </div>
                        }
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.accountUpdates}
                                onChange={() => handleToggle('accountUpdates')}
                                disabled={!isEditing}
                            />
                        }
                        label={
                            <div>
                                <div className="font-medium text-gray-900">Account Updates</div>
                                <div className="text-sm text-gray-600">Receive updates about your account changes</div>
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

export default NotificationSettings;