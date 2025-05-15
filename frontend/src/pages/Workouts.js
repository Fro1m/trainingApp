import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Workouts() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          תוכניות אימון
        </Typography>
        {/* Add your workouts content here */}
      </Box>
    </Container>
  );
}

export default Workouts; 