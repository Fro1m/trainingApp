import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Nutrition() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          תזונה
        </Typography>
        {/* Add your nutrition content here */}
      </Box>
    </Container>
  );
}

export default Nutrition; 