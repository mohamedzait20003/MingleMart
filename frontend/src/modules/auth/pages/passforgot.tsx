import { type FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import { EmailOutlined, ArrowForward } from '@mui/icons-material';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, Alert, CircularProgress, Link, Fade, Stack } from '@mui/material';

import { useForgotPasswordMutation } from '../../../store/apis/authApi';

interface ForgotPasswordFormData {
  email: string;
}

const PassForgot: FC = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading, error, isSuccess }] = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      toast.success('Password reset link sent! Check your email.');
    } catch (err) {
      console.error('Password reset failed:', err);
      toast.error('Failed to send reset link. Please try again.');
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
              Forgot your password?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No worries! Enter your email and we'll send you reset instructions
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
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {(error as any)?.data?.message || 'Failed to send reset link. Please try again.'}
              </Alert>
            )}
            {isSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Reset instructions sent! Check your email inbox and spam folder.
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} alignItems="center">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message || 'Enter the email associated with your account'}
                      placeholder="john@example.com"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #7b1fa2 100%)',
                      boxShadow: '0 6px 25px rgba(25, 118, 210, 0.5)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #90caf9 0%, #ce93d8 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Stack>
            </form>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Remember your password?
              </Typography>
              <Link
                component={RouterLink}
                to="/authenticate/login"
                color="primary"
                underline="hover"
                fontWeight="medium"
              >
                Back to Sign In
              </Link>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PassForgot;
