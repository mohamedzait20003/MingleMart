import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { LocalShipping, Security, HeadsetMic, ArrowForward, ShoppingCart } from '@mui/icons-material';
import { Box, Button, Container, Typography, Card, Grid, CardContent, CardMedia, Rating, IconButton } from '@mui/material';

const LHome: FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
          color: 'white',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } }}
              >
                Discover Amazing Deals Every Day
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Shop from thousands of products with free shipping and hassle-free returns. Your perfect find is just a click away.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button
                  component={Link}
                  to="/shop"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/deals"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    fontWeight: 'bold',
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                    },
                  }}
                >
                  View Deals
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            bgcolor: 'background.default',
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
          }}
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  <LocalShipping sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over $50. Fast and reliable delivery to your doorstep.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    color: 'secondary.main',
                    mb: 2,
                  }}
                >
                  <Security sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure transactions with multiple payment options.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    color: 'success.main',
                    mb: 2,
                  }}
                >
                  <HeadsetMic sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our team is here to help you anytime, anywhere.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Shop by Category
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Browse our wide selection of products across multiple categories
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: 'Electronics', color: '#1976d2', link: '/shop/electronics' },
              { name: 'Fashion', color: '#e91e63', link: '/shop/fashion' },
              { name: 'Home & Garden', color: '#4caf50', link: '/shop/home-garden' },
              { name: 'Sports', color: '#ff9800', link: '/shop/sports' },
            ].map((category) => (
              <Grid size={{ xs: 6, md: 3 }} key={category.name}>
                <Box
                  component={Link}
                  to={category.link}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative',
                      bgcolor: category.color,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {category.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    textAlign="center"
                    sx={{
                      mt: 1,
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    Explore {category.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trending Products Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="bold">
              Trending Products
            </Typography>
            <Button
              component={Link}
              to="/shop"
              endIcon={<ArrowForward />}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    sx={{
                      paddingTop: '100%',
                      bgcolor: 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={5} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        (128)
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Premium Product Name
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        $99.99
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { bgcolor: 'primary.dark' },
                        }}
                      >
                        <ShoppingCart fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LHome;
