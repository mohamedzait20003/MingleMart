import { type FC } from 'react';

import { MdComputer, MdSmartphone, MdTablet, MdLogout } from 'react-icons/md';

/** One row of the active-session list, as the backend's `sessions` table holds it. */
interface ActiveSession {
    location: string;
    deviceType: string;
    lastUsedAt: string;
}

const ActiveSessions: FC = () => {
    // The backend has SessionService.activeFor(userId) but no controller
    // exposing it yet, so this renders its empty state until that lands.
    const sessions: ActiveSession[] = [];
    
    const handleLogoutSession = (_sessionId: string) => {
        
    };

    const handleLogoutAllOthers = () => {
        
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile':
                return <MdSmartphone />;
            case 'tablet':
                return <MdTablet />;
            default:
                return <MdComputer />;
        }
    };

    return (
        <section id="active-sessions" className="pb-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Active Sessions</h2>
                    <p className="text-sm text-gray-500">Manage devices where you're currently logged in</p>
                </div>
                {sessions.length > 1 && (
                    <button type="button" onClick={handleLogoutAllOthers} className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                        <MdLogout />
                        Logout All Others
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {sessions.map((session, index) => {
                    const now = new Date();
                    const lastUsed = new Date(session.lastUsedAt);
                    const diffMs = now.getTime() - lastUsed.getTime();
                    const withinHalfHour = diffMs >= 0 && diffMs <= 30 * 60 * 1000;

                    return (
                        <div key={index} className="rounded-lg border border-gray-200 bg-white">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-600">{getDeviceIcon(session.deviceType)}</div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {session.deviceType}
                                            </p>
                                            {withinHalfHour && (
                                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">Current</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {session.location} • {lastUsed.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {!withinHalfHour && (
                                    <button
                                        type="button"
                                        onClick={() => handleLogoutSession(session.location)}
                                        className="inline-flex items-center gap-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <MdLogout />
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ActiveSessions;