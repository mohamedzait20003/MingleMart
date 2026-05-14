import { type FC } from 'react';
import { useSelector } from 'react-redux';

import { Button, Card, CardContent, Typography, Chip } from '@mui/material';
import { Computer, Smartphone, Tablet, Logout } from '@mui/icons-material';

import type { RootState } from '../../../store';

const ActiveSessions: FC = () => {
    const { sessions = [] } = useSelector((state: RootState) => state.user ?? { sessions: [] });
    
    const handleLogoutSession = (sessionId: string) => {
        
    };

    const handleLogoutAllOthers = () => {
        
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile':
                return <Smartphone />;
            case 'tablet':
                return <Tablet />;
            default:
                return <Computer />;
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
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Logout />}
                        onClick={handleLogoutAllOthers}
                    >
                        Logout All Others
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {sessions.map((session, index) => {
                    const now = new Date();
                    const lastUsed = new Date(session.lastUsedAt);
                    const diffMs = now.getTime() - lastUsed.getTime();
                    const withinHalfHour = diffMs >= 0 && diffMs <= 30 * 60 * 1000;

                    return (
                        <Card key={index} variant="outlined">
                            <CardContent className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-600">{getDeviceIcon(session.deviceType)}</div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Typography variant="subtitle2" className="font-medium">
                                                {session.deviceType}
                                            </Typography>
                                            {withinHalfHour && (
                                                <Chip label="Current" size="small" color="primary" />
                                            )}
                                        </div>
                                        <Typography variant="body2" color="text.secondary">
                                            {session.location} • {lastUsed.toLocaleString()}
                                        </Typography>
                                    </div>
                                </div>
                                {!withinHalfHour && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<Logout />}
                                        onClick={() => handleLogoutSession(session.location)}
                                    >
                                        Logout
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default ActiveSessions;