import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CreateWorkout from '../components/CreateWorkout';
import WorkoutTracker from '../components/WorkoutTracker';
import { LineChart } from '@mui/x-charts';
import { Calendar } from '@mui/x-date-pickers';

const TrainingPage = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    const handleOpenCreateDialog = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handleWorkoutCreated = () => {
        setIsCreateDialogOpen(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
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

                <Paper sx={{ mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab icon={<FitnessCenterIcon />} label="אימונים" />
                        <Tab icon={<ShowChartIcon />} label="התקדמות" />
                        <Tab icon={<CalendarMonthIcon />} label="לוח זמנים" />
                    </Tabs>
                </Paper>

                {activeTab === 0 && (
                    <WorkoutTracker key={refreshTrigger} />
                )}

                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        התקדמות משקולות
                                    </Typography>
                                    {/* Add WeightProgressChart component here */}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        סטטיסטיקות אימונים
                                    </Typography>
                                    {/* Add WorkoutStats component here */}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 2 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                לוח אימונים
                            </Typography>
                            {/* Add TrainingCalendar component here */}
                        </CardContent>
                    </Card>
                )}

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