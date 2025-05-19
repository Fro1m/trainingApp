import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Grid,
    CircularProgress,
    IconButton,
    InputAdornment,
    Tooltip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import trainingService from '../services/trainingService';

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedWorkout, setExpandedWorkout] = useState(null);
    const [tempWeights, setTempWeights] = useState({});
    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [manualRecordWeight, setManualRecordWeight] = useState('');

    const loadWorkouts = async () => {
        try {
            setLoading(true);
            console.log('Fetching workouts...');
            const data = await trainingService.getAllWorkouts();
            console.log('Received workouts:', data);
            setWorkouts(data);
            setError(null);
        } catch (error) {
            console.error('Error loading workouts:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWorkouts();
    }, []);

    const handleWeightChange = (workoutId, exerciseId, value) => {
        setTempWeights(prev => ({
            ...prev,
            [`${workoutId}-${exerciseId}`]: value
        }));
    };

    const handleWeightSubmit = async (workoutId, exerciseId) => {
        const weight = tempWeights[`${workoutId}-${exerciseId}`];
        if (!weight) return;
        
        try {
            const newWeight = parseFloat(weight);
            const exercise = workouts
                .find(w => w.id === workoutId)
                ?.muscle_groups
                .flatMap(g => g.exercises)
                .find(e => e.id === exerciseId);

            if (!exercise) return;

            // If current record is 0, use the new weight as record
            // Otherwise, use the maximum of new weight and current record
            const newRecordWeight = exercise.record_weight === 0 ? newWeight : Math.max(newWeight, exercise.record_weight);

            // First update local state to show immediate feedback
            setWorkouts(prevWorkouts => {
                return prevWorkouts.map(workout => {
                    if (workout.id === workoutId) {
                        return {
                            ...workout,
                            muscle_groups: workout.muscle_groups.map(group => ({
                                ...group,
                                exercises: group.exercises.map(exercise => {
                                    if (exercise.id === exerciseId) {
                                        return {
                                            ...exercise,
                                            current_weight: newWeight,
                                            last_weight: newWeight,
                                            record_weight: newRecordWeight
                                        };
                                    }
                                    return exercise;
                                })
                            }))
                        };
                    }
                    return workout;
                });
            });

            // Then update the server
            await trainingService.updateExerciseProgress(
                workoutId,
                exerciseId,
                {
                    current_weight: newWeight,
                    last_weight: newWeight,
                    record_weight: newRecordWeight
                }
            );

            // Clear the temporary weight
            setTempWeights(prev => {
                const newWeights = { ...prev };
                delete newWeights[`${workoutId}-${exerciseId}`];
                return newWeights;
            });
        } catch (error) {
            console.error('Error updating weight:', error);
            // Reload workouts if there was an error
            await loadWorkouts();
        }
    };

    const handleResetRecord = async (workoutId, exerciseId) => {
        try {
            const exercise = workouts
                .find(w => w.id === workoutId)
                ?.muscle_groups
                .flatMap(g => g.exercises)
                .find(e => e.id === exerciseId);

            if (!exercise) return;

            // First update local state to show immediate feedback
            setWorkouts(prevWorkouts => {
                return prevWorkouts.map(workout => {
                    if (workout.id === workoutId) {
                        return {
                            ...workout,
                            muscle_groups: workout.muscle_groups.map(group => ({
                                ...group,
                                exercises: group.exercises.map(exercise => {
                                    if (exercise.id === exerciseId) {
                                        return {
                                            ...exercise,
                                            record_weight: 0  // Reset record to zero
                                        };
                                    }
                                    return exercise;
                                })
                            }))
                        };
                    }
                    return workout;
                });
            });

            // Then update the server
            await trainingService.updateExerciseProgress(
                workoutId,
                exerciseId,
                {
                    current_weight: exercise.current_weight,
                    last_weight: exercise.last_weight,
                    record_weight: 0  // Reset record to zero
                }
            );
        } catch (error) {
            console.error('Error resetting record:', error);
            // Reload workouts if there was an error
            await loadWorkouts();
        }
    };

    const handleAccordionChange = (workoutId) => (event, isExpanded) => {
        setExpandedWorkout(isExpanded ? workoutId : null);
    };

    const handleOpenRecordDialog = (workoutId, exerciseId, currentRecord) => {
        setSelectedExercise({ workoutId, exerciseId });
        setManualRecordWeight(currentRecord.toString());
        setRecordDialogOpen(true);
    };

    const handleCloseRecordDialog = () => {
        setRecordDialogOpen(false);
        setSelectedExercise(null);
        setManualRecordWeight('');
    };

    const handleManualRecordSubmit = async () => {
        if (!selectedExercise || !manualRecordWeight) return;
        
        try {
            const newWeight = parseFloat(manualRecordWeight);
            const exercise = workouts
                .find(w => w.id === selectedExercise.workoutId)
                ?.muscle_groups
                .flatMap(g => g.exercises)
                .find(e => e.id === selectedExercise.exerciseId);

            if (!exercise) return;

            // First update local state to show immediate feedback
            setWorkouts(prevWorkouts => {
                return prevWorkouts.map(workout => {
                    if (workout.id === selectedExercise.workoutId) {
                        return {
                            ...workout,
                            muscle_groups: workout.muscle_groups.map(group => ({
                                ...group,
                                exercises: group.exercises.map(exercise => {
                                    if (exercise.id === selectedExercise.exerciseId) {
                                        return {
                                            ...exercise,
                                            record_weight: newWeight
                                        };
                                    }
                                    return exercise;
                                })
                            }))
                        };
                    }
                    return workout;
                });
            });

            // Then update the server
            await trainingService.updateExerciseProgress(
                selectedExercise.workoutId,
                selectedExercise.exerciseId,
                {
                    current_weight: exercise.current_weight,
                    last_weight: exercise.last_weight,
                    record_weight: newWeight
                }
            );

            handleCloseRecordDialog();
        } catch (error) {
            console.error('Error updating record weight:', error);
            await loadWorkouts();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography color="error">שגיאה בטעינת האימונים: {error}</Typography>
                <Button 
                    variant="contained" 
                    onClick={loadWorkouts}
                    sx={{ mt: 2 }}
                >
                    נסה שוב
                </Button>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
                {workouts && workouts.length > 0 ? (
                    workouts.map((workout) => (
                        <Accordion 
                            key={workout.id} 
                            sx={{ 
                                mb: 2,
                                '&:before': {
                                    display: 'none',
                                },
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                            expanded={expandedWorkout === workout.id}
                            onChange={handleAccordionChange(workout.id)}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    '& .MuiAccordionSummary-content': {
                                        margin: '12px 0',
                                        justifyContent: 'center',
                                    },
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                                    {workout.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: { xs: 1, sm: 2 } }}>
                                {workout.muscle_groups && workout.muscle_groups.map((group, index) => (
                                    <Paper 
                                        key={group.id} 
                                        sx={{ 
                                            p: { xs: 1.5, sm: 2 }, 
                                            mb: 2,
                                            backgroundColor: 'background.paper',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            sx={{ 
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                                                textAlign: 'center',
                                            }}
                                        >
                                            {group.name}
                                        </Typography>
                                        <List sx={{ p: 0 }}>
                                            {group.exercises && group.exercises.map((exercise, exIndex) => (
                                                <React.Fragment key={exercise.id}>
                                                    {exIndex > 0 && <Divider />}
                                                    <ListItem 
                                                        sx={{ 
                                                            px: { xs: 0, sm: 2 },
                                                            py: 1.5,
                                                        }}
                                                    >
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={4}>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography 
                                                                            variant="subtitle1" 
                                                                            sx={{ 
                                                                                fontWeight: 'medium',
                                                                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {exercise.name}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            color="text.secondary"
                                                                            sx={{ 
                                                                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                                                textAlign: 'right',
                                                                            }}
                                                                        >
                                                                            {`${exercise.sets} סטים × ${exercise.reps} חזרות`}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={8}>
                                                                <Box 
                                                                    sx={{ 
                                                                        display: 'flex', 
                                                                        gap: { xs: 1, sm: 2 }, 
                                                                        alignItems: 'center', 
                                                                        flexWrap: 'wrap',
                                                                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                                                                    }}
                                                                >
                                                                    <Box sx={{ width: { xs: '100%', sm: 120 } }}>
                                                                        <input
                                                                            type="number"
                                                                            value={tempWeights[`${workout.id}-${exercise.id}`] ?? ''}
                                                                            onChange={(e) => handleWeightChange(
                                                                                workout.id,
                                                                                exercise.id,
                                                                                e.target.value
                                                                            )}
                                                                            placeholder="משקל נוכחי"
                                                                            min="0"
                                                                            step="0.5"
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '40px',
                                                                                padding: '8px',
                                                                                border: '1px solid #ccc',
                                                                                borderRadius: '4px',
                                                                                textAlign: 'right',
                                                                                fontSize: '14px'
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        onClick={() => handleWeightSubmit(workout.id, exercise.id)}
                                                                        sx={{ 
                                                                            minWidth: { xs: '100%', sm: 'auto' },
                                                                            height: { xs: 48, sm: 40 },
                                                                        }}
                                                                    >
                                                                        שמור
                                                                    </Button>
                                                                    <Box 
                                                                        sx={{ 
                                                                            display: 'flex', 
                                                                            gap: 1,
                                                                            width: { xs: '100%', sm: 'auto' },
                                                                            justifyContent: { xs: 'space-between', sm: 'flex-start' },
                                                                        }}
                                                                    >
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            color="text.secondary"
                                                                            sx={{ 
                                                                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                                            }}
                                                                        >
                                                                            שיא: {exercise.record_weight} ק"ג
                                                                        </Typography>
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            color="text.secondary"
                                                                            sx={{ 
                                                                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                                                            }}
                                                                        >
                                                                            אימון קודם: {exercise.last_weight} ק"ג
                                                                        </Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                                            <Button
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onClick={() => handleOpenRecordDialog(workout.id, exercise.id, exercise.record_weight)}
                                                                                sx={{ 
                                                                                    height: { xs: 48, sm: 40 },
                                                                                    minWidth: { xs: 'auto', sm: 100 },
                                                                                }}
                                                                            >
                                                                                ערוך שיא
                                                                            </Button>
                                                                            <Button
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onClick={() => handleResetRecord(workout.id, exercise.id)}
                                                                                sx={{ 
                                                                                    height: { xs: 48, sm: 40 },
                                                                                    minWidth: { xs: 'auto', sm: 100 },
                                                                                }}
                                                                            >
                                                                                אפס שיא
                                                                            </Button>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Paper>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography variant="body1" textAlign="center" sx={{ my: 4 }}>
                        אין אימונים זמינים
                    </Typography>
                )}
            </Box>

            <Dialog 
                open={recordDialogOpen} 
                onClose={handleCloseRecordDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>ערוך משקל שיא</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="משקל שיא"
                        type="number"
                        fullWidth
                        value={manualRecordWeight}
                        onChange={(e) => setManualRecordWeight(e.target.value)}
                        inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            min: 0,
                            step: 0.5
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRecordDialog}>ביטול</Button>
                    <Button onClick={handleManualRecordSubmit} variant="contained">
                        שמור
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WorkoutTracker; 