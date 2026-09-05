import { type FC } from 'react';
import { InboxIcon, RefreshCwIcon, SearchIcon } from 'lucide-react';

import { navUrls } from '@/lib/utils/navUrls';
import { Stagger } from '@/common/components/animation/reveal';

import { AuthOutcome } from '../components/auth-outcome';
import { AuthPrimaryLink } from '../components/auth-links';
import { AuthShell } from '../components/auth-shell';

const STEPS = [
  {
    icon: InboxIcon,
    title: 'Open the email we just sent',
    body: 'It arrives within a minute or two, from hello@minglemart.com.',
  },
  {
    icon: SearchIcon,
    title: 'Not there? Look in spam',
    body: 'First emails from a new sender are filtered more often than you would think.',
  },
  {
    icon: RefreshCwIcon,
    title: 'Still nothing? Sign in again',
    body: 'Signing in issues a fresh link and invalidates the old one.',
  },
];

const AccVerify: FC = () => (
  <AuthShell>
    <AuthOutcome
      kind="mail"
      tone="primary"
      markLabel="Verification email sent"
      title="Verify your email"
      description="Your account exists — it just needs the link in your inbox before you can sign in."
      actions={<AuthPrimaryLink to={navUrls.auth.login}>Back to sign in</AuthPrimaryLink>}
    >
      <Stagger as="ol" step={70} className="flex w-full flex-col gap-4 text-left">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-3.5">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <Icon className="size-4.5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{title}</span>
              <span className="mt-0.5 block text-sm text-pretty text-muted-foreground">
                {body}
              </span>
            </span>
          </li>
        ))}
      </Stagger>
    </AuthOutcome>
  </AuthShell>
);

export default AccVerify;
