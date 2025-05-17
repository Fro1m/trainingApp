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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import trainingService from '../services/trainingService';

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedWorkout, setExpandedWorkout] = useState(null);
    const [tempWeights, setTempWeights] = useState({});

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
                                            record_weight: newWeight > exercise.record_weight ? newWeight : exercise.record_weight
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
                    record_weight: newWeight > exercise.record_weight ? newWeight : exercise.record_weight
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
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
            {workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
                    <Accordion 
                        key={workout.id} 
                        sx={{ mb: 2 }}
                        expanded={expandedWorkout === workout.id}
                        onChange={handleAccordionChange(workout.id)}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">{workout.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {workout.muscle_groups && workout.muscle_groups.map((group) => (
                                <Paper key={group.id} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {group.name}
                                    </Typography>
                                    <List>
                                        {group.exercises && group.exercises.map((exercise) => (
                                            <ListItem key={exercise.id}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={4}>
                                                        <ListItemText
                                                            primary={exercise.name}
                                                            secondary={`${exercise.sets} סטים × ${exercise.reps} חזרות`}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={8}>
                                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                                            <TextField
                                                                label="משקל נוכחי"
                                                                type="number"
                                                                value={tempWeights[`${workout.id}-${exercise.id}`] ?? exercise.current_weight}
                                                                onChange={(e) => handleWeightChange(
                                                                    workout.id,
                                                                    exercise.id,
                                                                    e.target.value
                                                                )}
                                                                size="small"
                                                                sx={{ width: 120 }}
                                                                inputProps={{
                                                                    inputMode: 'numeric',
                                                                    pattern: '[0-9]*',
                                                                    'aria-label': 'משקל נוכחי',
                                                                    min: 0,
                                                                    step: 0.5
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onFocus={(e) => e.stopPropagation()}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleWeightSubmit(workout.id, exercise.id)}
                                                                                color="primary"
                                                                                aria-label="שמור משקל"
                                                                            >
                                                                                <CheckIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                            <Typography variant="body2" color="text.secondary">
                                                                אחרון: {exercise.last_weight}kg
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="primary">
                                                                    שיא: {exercise.record_weight}kg
                                                                </Typography>
                                                                <Tooltip title="אפס שיא">
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleResetRecord(workout.id, exercise.id)}
                                                                        color="primary"
                                                                        aria-label="אפס שיא"
                                                                    >
                                                                        <RefreshIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                    לא נמצאו אימונים. צור את האימון הראשון שלך כדי להתחיל!
                </Typography>
            )}
        </Box>
    );
};

export default WorkoutTracker; 