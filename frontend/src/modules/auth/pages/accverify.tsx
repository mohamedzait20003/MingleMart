import { type FC, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { Box, Button, Typography, Container, Paper, Fade, CircularProgress } from '@mui/material';

import { useResendVerificationMutation } from '../../../store/apis/authApi';

const AccVerify: FC = () => {
  const [countdown, setCountdown] = useState(0);

  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    try {
      await resendVerification().unwrap();
      toast.success('Verification email resent! Check your inbox.');
      setCountdown(60);
    } catch (err) {
      console.error('Resend failed:', err);
      toast.error('Failed to resend email. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        py: { xs: 4, md: 8 },
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              Verify Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We've sent a verification code to your email address
            </Typography>
          </Box>
        </Fade>
        <Fade in timeout={700}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn't receive the email?
              </Typography>
              <Button
                onClick={handleResend}
                disabled={isResending || countdown > 0}
                variant="text"
                color="primary"
              >
                {isResending ? <CircularProgress size={24} /> : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default AccVerify;
