import { type FC, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import { Visibility, VisibilityOff, PersonOutline, EmailOutlined, LockOutlined, ArrowForward } from '@mui/icons-material';
import { Box, TextField, Button, Typography, Container, Paper, InputAdornment, IconButton, Checkbox, FormControlLabel, Alert, Divider, CircularProgress, Link, Fade, Stack } from '@mui/material';

import { useSignupMutation, useGoogleloginMutation } from '../../../store/apis/authApi';

interface SignupFormData {
  fName: string;
  lName: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  terms: boolean;
}

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signup, { isLoading, error }] = useSignupMutation();
  const [googlelogin, { isLoading: isGoogleLoading }] = useGoogleloginMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    mode: 'onTouched',
    defaultValues: {
      fName: '',
      lName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      terms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        fName: data.fName,
        lName: data.lName,
        username: data.username,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      }).unwrap();

      toast.success('Signup successful! Please verify your email.');
      navigate('/authenticate/account-verify');
    } catch (err) {
      console.error('Signup failed:', err);
      toast.error('Signup failed. Please try again.');
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
              Create your account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join thousands of happy shoppers today
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
                {(error as any)?.data?.message || 'Signup failed. Please try again.'}
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
                Or sign up with email
              </Typography>
            </Divider>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2.5} alignItems="center">
                {/* First Name and Last Name in the same row */}
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Controller
                    name="fName"
                    control={control}
                    rules={{
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' },
                      maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        error={!!errors.fName}
                        helperText={errors.fName?.message}
                        placeholder="John"
                        variant="outlined"
                      />
                    )}
                  />
                  <Controller
                    name="lName"
                    control={control}
                    rules={{
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' },
                      maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        error={!!errors.lName}
                        helperText={errors.lName?.message}
                        placeholder="Doe"
                        variant="outlined"
                      />
                    )}
                  />
                </Stack>

                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' },
                    maxLength: { value: 50, message: 'Maximum 50 characters allowed' },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Only letters, numbers, and underscores allowed',
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      placeholder="johndoe"
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutline color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          paddingLeft: '8px',
                        },
                      }}
                    />
                  )}
                />
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
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlined color="action" />
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          paddingLeft: '8px',
                        },
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
                    maxLength: { value: 100, message: 'Maximum 100 characters allowed' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message || 'Must be at least 6 characters'}
                      placeholder="••••••••"
                      variant="outlined"
                      slotProps={{
                        input: {
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
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          paddingLeft: '8px',
                        },
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
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.passwordConfirmation}
                      helperText={errors.passwordConfirmation?.message}
                      placeholder="••••••••"
                      variant="outlined"
                      slotProps={{
                        input: {
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
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          paddingLeft: '8px',
                        },
                      }}
                    />
                  )}
                />
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="terms"
                    control={control}
                    rules={{ required: 'You must accept the terms and conditions' }}
                    render={({ field }) => (
                      <>
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} color="primary" />}
                          label={
                            <Typography variant="body2" color="text.secondary">
                              I agree to the{' '}
                              <Link component={RouterLink} to="/terms" color="primary" underline="hover">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link component={RouterLink} to="/privacy" color="primary" underline="hover">
                                Privacy Policy
                              </Link>
                            </Typography>
                          }
                        />
                        {errors.terms && (
                          <Typography variant="caption" color="error" sx={{ ml: 2, display: 'block' }}>
                            {errors.terms.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Stack>
            </form>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?
              </Typography>
            </Divider>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/authenticate/login"
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  py: 1,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Sign In Instead
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default SignUp;
