import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Photos() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          תמונות מהתהליך
        </Typography>
        {/* Add your photos content here */}
      </Box>
    </Container>
  );
}

export default Photos; 