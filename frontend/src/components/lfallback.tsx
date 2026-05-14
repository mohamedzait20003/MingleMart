import { Box, CircularProgress } from '@mui/material';

const LoadingFallback = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <CircularProgress size={60} thickness={4} />
    </Box>
);

export default LoadingFallback;
