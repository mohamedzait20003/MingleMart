import { type FC, useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Visibility, VisibilityOff, LockOutlined, ArrowForward } from '@mui/icons-material';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, IconButton, Alert, CircularProgress, Link, Fade, Stack } from '@mui/material';

import { useResetPasswordMutation } from '../../../store/apis/authApi';

interface PasswordChangeFormData {
  password: string;
  passwordConfirmation: string;
}

const PassChange: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    mode: 'onTouched',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: PasswordChangeFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token. Please request a new password reset.');
      return;
    }

    try {
      await resetPassword({
        token,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      }).unwrap();

      toast.success('Password reset successful! You can now log in with your new password.');
      navigate('/authenticate/login');
    } catch (err) {
      console.error('Password reset failed:', err);
      toast.error('Failed to reset password. Please try again.');
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
              Set New Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose a strong password to secure your account
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
                {(error as any)?.data?.message || 'Failed to reset password. Please try again.'}
              </Alert>
            )}
            {!token && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Invalid or missing reset token. Please request a new password reset.
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} alignItems="center">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters required' },
                    maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message || 'Must be at least 6 characters'}
                      placeholder="••••••••"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  name="passwordConfirmation"
                  control={control}
                  rules={{
                    required: 'Password confirmation is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm New Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.passwordConfirmation}
                      helperText={errors.passwordConfirmation?.message}
                      placeholder="••••••••"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              aria-label="toggle password confirmation visibility"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading || !token}
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
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default PassChange;