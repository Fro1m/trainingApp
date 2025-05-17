import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateWorkout from '../components/CreateWorkout';
import WorkoutTracker from '../components/WorkoutTracker';

const TrainingPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleWorkoutCreated = () => {
        setIsCreateDialogOpen(false);
        // Trigger a refresh of the workout list
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        תוכניות אימונים
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreateDialog}
                    >
                        צור אימון חדש
                    </Button>
                </Box>

                <WorkoutTracker key={refreshTrigger} />

                <Dialog
                    open={isCreateDialogOpen}
                    onClose={handleCloseCreateDialog}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>צור אימון חדש</DialogTitle>
                    <DialogContent>
                        <CreateWorkout onSuccess={handleWorkoutCreated} />
                    </DialogContent>
                </Dialog>
            </Box>
        </Container>
    );
};

export default TrainingPage; 