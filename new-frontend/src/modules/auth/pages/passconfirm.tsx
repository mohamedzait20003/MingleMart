import { type FC, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { CheckCircle, ArrowForward } from '@mui/icons-material';
import { Box, Button, Typography, Container, Paper, Fade } from '@mui/material';

const PassConfirm: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/authenticate/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your password has been successfully changed
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
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You can now sign in to your account with your new password.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You will be automatically redirected to the login page in a few seconds.
              </Typography>

              <Button
                component={RouterLink}
                to="/authenticate/login"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<ArrowForward />}
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
                Sign In Now
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PassConfirm;