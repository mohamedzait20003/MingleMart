import { type FC, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { CheckCircle, ErrorOutline, HourglassEmpty } from '@mui/icons-material';
import { Box, Button, Typography, Container, Paper, Fade, CircularProgress, Alert } from '@mui/material';

import { useVerifyEmailMutation } from '../../../store/apis/authApi';

const EmaVerify: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const [verifyEmail, { isLoading, isSuccess, error }] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyAccount = async () => {
      try {
        await verifyEmail({ token }).unwrap();
        toast.success('Email verified successfully! Redirecting to your dashboard...');
        
        setTimeout(() => {
          navigate('/customer');
        }, 5000);
      } catch (err: any) {
        console.error('Verification failed:', err);
        toast.error('Email verification failed.');
      }
    };

    verifyAccount();
  }, [token, verifyEmail, navigate]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                mb: 2,
              }}
            >
              <HourglassEmpty sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              Verifying Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we verify your account...
            </Typography>
          </Box>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              Verifying your email address...
            </Typography>
          </Paper>
        </>
      );
    }

    if (isSuccess) {
      return (
        <>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                mb: 2,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your account has been successfully verified
            </Typography>
          </Box>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been verified successfully! Welcome to ZCommerce!
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              You will be automatically redirected to your dashboard in 5 seconds.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/customer')}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                  boxShadow: '0 6px 25px rgba(25, 118, 210, 0.5)',
                },
              }}
            >
              Go to Dashboard
            </Button>
          </Paper>
        </>
      );
    }

    return (
      <>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
              mb: 2,
            }}
          >
            <ErrorOutline sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Verification Failed
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We couldn't verify your email address
          </Typography>
        </Box>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            {!token ? 'Invalid or missing verification token.' : (error as any)?.data?.message || 'Verification failed. The link may be expired or invalid.'}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            The verification link may have expired or is invalid. Please contact support or try signing up again.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/authenticate/login"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                  boxShadow: '0 6px 25px rgba(25, 118, 210, 0.5)',
                },
              }}
            >
              Back to Sign In
            </Button>
            <Button
              component={Link}
              to="/authenticate/sign-up"
              variant="outlined"
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 },
              }}
            >
              Sign Up Again
            </Button>
          </Box>
        </Paper>
      </>
    );
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
          <Box>
            {renderContent()}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default EmaVerify;