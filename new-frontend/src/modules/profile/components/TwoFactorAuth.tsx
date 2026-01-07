import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Shield } from '@mui/icons-material';
import { Button, Switch, FormControlLabel, TextField, Alert } from '@mui/material';

import type { RootState } from '../../../store';

const TwoFactorAuth: FC = () => {
    const { faEnabled } = useSelector((state: RootState) => state.user);

    const [showSetup, setShowSetup] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(faEnabled ?? false);
    

    const handleToggle2FA = () => {
        if (!is2FAEnabled) {
            setShowSetup(true);
        } else {
            // Handle disabling 2FA
            setIs2FAEnabled(false);
            setShowSetup(false);
        }
    };

    const handleVerifyCode = () => {
        // Handle verification code logic
        if (verificationCode.length === 6) {
            setIs2FAEnabled(true);
            setShowSetup(false);
            setVerificationCode('');
        }
    };

    return (
        <section id="two-factor" className="pb-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Two-Factor Authentication</h2>
                    <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                    </p>
                </div>
                <FormControlLabel
                    control={
                        <Switch
                            checked={is2FAEnabled}
                            onChange={handleToggle2FA}
                            color="primary"
                        />
                    }
                    label={is2FAEnabled ? 'Enabled' : 'Disabled'}
                />
            </div>

            {is2FAEnabled && (
                <Alert severity="success" icon={<Shield />} className="mt-4">
                    Two-factor authentication is active on your account
                </Alert>
            )}

            {showSetup && !is2FAEnabled && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Setup Instructions</h3>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                            <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                            <li>Scan the QR code below with your authenticator app</li>
                            <li>Enter the 6-digit code from your app to verify</li>
                        </ol>
                    </div>

                    <div className="flex justify-center p-4 bg-white rounded border">
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">QR Code Placeholder</span>
                        </div>
                    </div>

                    <TextField
                        label="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        inputProps={{ maxLength: 6 }}
                        fullWidth
                    />

                    <div className="flex gap-2">
                        <Button
                            variant="contained"
                            onClick={handleVerifyCode}
                            disabled={verificationCode.length !== 6}
                        >
                            Verify & Enable
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setShowSetup(false);
                                setVerificationCode('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TwoFactorAuth;