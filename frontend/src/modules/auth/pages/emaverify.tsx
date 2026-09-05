import { type FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { navUrls } from '@/lib/utils/navUrls';
import { Card, CardContent } from '@/common/components/ui/card';
import { Spinner } from '@/common/components/ui/spinner';
import { Reveal } from '@/common/components/animation/reveal';
import { Swap } from '@/common/components/animation/swap';
import { useEmailVerification } from '@/lib/hooks/useUser';
import { apiErrorMessage } from '@/lib/utils/apiError';
import { currentLanding } from '@/lib/auth/session';

import { AuthOutcome } from '../components/auth-outcome';
import { AuthPrimaryLink, AuthSecondaryLink } from '../components/auth-links';
import { AuthShell } from '../components/auth-shell';

const EmaVerify: FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    // The hook owns the request, the toasts, and the delayed forward to the
    // reader's landing. What is left here is which of three faces to show.
    const { isLoading, isSuccess, error } = useEmailVerification(token);

    // "Settled with no result" is still pending: the request starts in an
    // effect, so the first paint has neither a result nor `isLoading` yet, and
    // reading that as failure would flash a red cross at everyone.
    const state = !token
        ? 'failed'
        : isSuccess
          ? 'success'
          : isLoading || !error
            ? 'pending'
            : 'failed';

    return (
        <AuthShell>
            <Swap swapKey={state}>
                {state === 'pending' && (
                    <Reveal>
                        <Card className="border border-border bg-card/85 text-center shadow-xl backdrop-blur [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
                            <CardContent className="flex flex-col items-center gap-5">
                                <span className="inline-flex size-20 items-center justify-center rounded-full bg-primary/12 text-primary ring-8 ring-primary/25">
                                    <Spinner className="size-9" aria-hidden="true" />
                                </span>
                                <div className="flex flex-col gap-2">
                                    <h1 className="font-heading text-2xl font-extrabold tracking-tight text-balance sm:text-3xl">
                                        Verifying your email
                                    </h1>
                                    {/* The one live region on the page: this is the
                                        sentence whose truth is about to change. */}
                                    <p
                                        aria-live="polite"
                                        className="text-pretty text-muted-foreground"
                                    >
                                        One moment while we check the link you followed.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Reveal>
                )}

                {state === 'success' && (
                    <AuthOutcome
                        kind="check"
                        tone="success"
                        markLabel="Email verified"
                        title="You are verified"
                        description="Your email is confirmed and your account is ready. We will take you through in a moment."
                        actions={
                            <button
                                type="button"
                                onClick={() => navigate(currentLanding())}
                                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-sm transition-colors outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40"
                            >
                                Start shopping
                            </button>
                        }
                    />
                )}

                {state === 'failed' && (
                    <AuthOutcome
                        kind="cross"
                        tone="destructive"
                        markLabel="Verification failed"
                        title="That link did not work"
                        description={
                            token
                                ? apiErrorMessage(
                                      error,
                                      'It may have expired or already been used. Signing in issues a fresh one.'
                                  )
                                : 'The link is missing its verification token, so we cannot tell which account it belongs to.'
                        }
                        actions={
                            <>
                                <AuthPrimaryLink to={navUrls.auth.login}>
                                    Sign in to get a new link
                                </AuthPrimaryLink>
                                <AuthSecondaryLink to={navUrls.auth.signUp}>
                                    Create an account instead
                                </AuthSecondaryLink>
                            </>
                        }
                    />
                )}
            </Swap>
        </AuthShell>
    );
};

export default EmaVerify;
