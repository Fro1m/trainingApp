import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Weight() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          מעקב שקילות
        </Typography>
        {/* Add your weight tracking content here */}
      </Box>
    </Container>
  );
}

export default Weight; 