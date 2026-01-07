import { type FC, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, ArrowForward } from '@mui/icons-material';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, IconButton, Checkbox, FormControlLabel, Alert, Divider, CircularProgress, Link, Fade, Stack } from '@mui/material';

import { useLoginMutation, useGoogleloginMutation } from '../../../store/apis/authApi';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const [googlelogin, { isLoading: isGoogleLoading }] = useGoogleloginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success('Login successful!');

      if (response.data.role === 'customer') {
        navigate('/customer');
      } else if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      await googlelogin({ idToken }).unwrap();
      toast.success('Signed in with Google!');
      navigate('/customer');
    } catch (err) {
      console.error('Google login failed:', err);
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    toast.error('Google login failed. Please try again.');
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
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue your shopping journey
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
                {(error as any)?.data?.message || 'Login failed. Please try again.'}
              </Alert>
            )}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
              />
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Or sign in with email
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5} alignItems="center">
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
                      helperText={errors.email?.message}
                      placeholder="john@example.com"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters required' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
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
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} color="primary" />}
                        label={
                          <Typography variant="body2" color="text.secondary">
                            Remember me
                          </Typography>
                        }
                      />
                    )}
                  />
                  <Link
                    component={RouterLink}
                    to="/authenticate/password-forgot"
                    variant="body2"
                    color="primary"
                    underline="hover"
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading || isGoogleLoading}
                  endIcon={(isLoading || isGoogleLoading) ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
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
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </form>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
            </Divider>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/authenticate/sign-up"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ 
                  py: 1,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Create Account
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
