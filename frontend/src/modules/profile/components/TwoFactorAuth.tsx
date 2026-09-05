import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { MdShield } from 'react-icons/md';

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
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        checked={is2FAEnabled}
                        onChange={handleToggle2FA}
                        className="peer sr-only"
                    />
                    <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-disabled:opacity-50" />
                    <span className="text-sm font-medium text-gray-700">
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </label>
            </div>

            {is2FAEnabled && (
                <div
                    role="status"
                    className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                >
                    <MdShield className="shrink-0" />
                    Two-factor authentication is active on your account
                </div>
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

                    <label className="block">
                        <span className="mb-1 block text-sm font-medium text-gray-700">Verification Code</span>
                        <input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                    </label>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleVerifyCode}
                            disabled={verificationCode.length !== 6}
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Verify &amp; Enable
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowSetup(false);
                                setVerificationCode('');
                            }}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TwoFactorAuth;