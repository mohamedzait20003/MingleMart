import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { navUrls } from '@/lib/utils/navUrls';

import { AuthOutcome } from '../components/auth-outcome';
import { AuthPrimaryLink } from '../components/auth-links';
import { AuthShell } from '../components/auth-shell';

const REDIRECT_SECONDS = 8;

const PassConfirm: FC = () => {
    const navigate = useNavigate();
    const [remaining, setRemaining] = useState(REDIRECT_SECONDS);

    // Counts down in the open rather than jumping without warning, and the
    // button below always beats the timer for anyone who does not want to wait.
    useEffect(() => {
        const timer = setInterval(() => {
            setRemaining((seconds) => {
                if (seconds <= 1) {
                    clearInterval(timer);
                    navigate(navUrls.auth.login);
                    return 0;
                }
                return seconds - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <AuthShell>
            <AuthOutcome
                kind="check"
                tone="success"
                markLabel="Password changed"
                title="That is done"
                description="Your password has been changed. Any other device that was signed in has been signed out."
                actions={
                    <>
                        <AuthPrimaryLink to={navUrls.auth.login}>Sign in now</AuthPrimaryLink>
                        <p className="text-sm text-muted-foreground">
                            Taking you there in{' '}
                            <span className="font-semibold tabular-nums">{remaining}</span>{' '}
                            {remaining === 1 ? 'second' : 'seconds'}.
                        </p>
                    </>
                }
            />
        </AuthShell>
    );
};

export default PassConfirm;
