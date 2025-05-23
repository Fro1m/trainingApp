import React from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSwipeable } from 'react-swipeable';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import TrainingPage from './pages/TrainingPage';
import Nutrition from './pages/Nutrition';
import Weight from './pages/Weight';
import Photos from './pages/Photos';

// Create RTL theme
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    h2: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
  },
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
});

// Styled components
const StyledCard = styled(Card)(({ theme, isSwiping }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: isSwiping ? 'none' : 'transform 0.3s ease-in-out',
  cursor: 'pointer',
  transform: isSwiping ? 'scale(0.95)' : 'scale(1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down('sm')]: {
    '&:hover': {
      transform: 'none',
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    fontSize: 60,
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: 45,
    },
  },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Custom hook for swipe handling
const useSwipeHandlers = (onSwipe) => {
  return useSwipeable({
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10,
    swipeDuration: 500,
  });
};

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = React.useState(null);

  const menuItems = [
    {
      title: 'אימונים',
      icon: <FitnessCenterIcon />,
      description: 'תוכניות אימון מותאמות אישית',
      path: '/training'
    },
    {
      title: 'תזונה',
      icon: <RestaurantIcon />,
      description: 'תוכניות תזונה מאוזנות',
      path: '/nutrition'
    },
    {
      title: 'שקילות',
      icon: <MonitorWeightIcon />,
      description: 'מעקב אחר התקדמות',
      path: '/weight'
    },
    {
      title: 'תמונות מהתהליך',
      icon: <PhotoLibraryIcon />,
      description: 'תיעוד השינוי',
      path: '/photos'
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleSwipe = (path, direction) => {
    if (direction === 'right') {
      navigate(path);
    }
  };

  const CardWithSwipe = ({ index, item }) => {
    const swipeHandlers = useSwipeHandlers((direction) => handleSwipe(item.path, direction));
    
    return (
      <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
        <div {...swipeHandlers}>
          <StyledCard 
            isSwiping={activeCard === index}
            onClick={() => handleCardClick(item.path)}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
              <IconWrapper>
                {item.icon}
              </IconWrapper>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  mb: { xs: 1, sm: 2 }
                }}
              >
                {item.title}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {item.description}
              </Typography>
            </CardContent>
          </StyledCard>
        </div>
      </Zoom>
    );
  };

  return (
    <GradientBackground>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          align="center"
          color="white"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: { xs: 4, sm: 6 },
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          ברוכים הבאים לאפליקציית האימון
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <CardWithSwipe index={index} item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </GradientBackground>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 