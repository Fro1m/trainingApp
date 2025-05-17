import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import trainingService from '../services/trainingService';

const MUSCLE_GROUPS = [
    'חזה', 'גב', 'כתפיים', 'יד קדמית', 'יד אחורית',
    'רגליים', 'בטן', 'שוקיים', 'אמות'
];

const CreateWorkout = ({ onSuccess }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [exercises, setExercises] = useState({});

    const handleAddMuscleGroup = () => {
        if (selectedMuscleGroup && !muscleGroups.includes(selectedMuscleGroup)) {
            setMuscleGroups([...muscleGroups, selectedMuscleGroup]);
            setExercises({ ...exercises, [selectedMuscleGroup]: [] });
        }
    };

    const handleAddExercise = (muscleGroup) => {
        const exerciseName = prompt('הכנס שם התרגיל:');
        if (exerciseName) {
            const sets = prompt('הכנס מספר סטים:');
            const reps = prompt('הכנס מספר חזרות:');
            
            const newExercise = {
                name: exerciseName,
                sets: parseInt(sets) || 0,
                reps: parseInt(reps) || 0,
                current_weight: 0,
                last_weight: 0,
                record_weight: 0
            };

            setExercises({
                ...exercises,
                [muscleGroup]: [...exercises[muscleGroup], newExercise]
            });
        }
    };

    const handleRemoveExercise = (muscleGroup, index) => {
        const updatedExercises = exercises[muscleGroup].filter((_, i) => i !== index);
        setExercises({
            ...exercises,
            [muscleGroup]: updatedExercises
        });
    };

    const handleSubmit = async () => {
        try {
            const workoutData = {
                name: workoutName,
                muscle_groups: muscleGroups.map(group => ({
                    name: group,
                    exercises: exercises[group]
                }))
            };
            
            await trainingService.createWorkout(workoutData);
            onSuccess?.();
        } catch (error) {
            console.error('Error creating workout:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <TextField
                fullWidth
                label="שם האימון"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                margin="normal"
                dir="rtl"
            />

            <Box sx={{ my: 2 }}>
                <Typography variant="h6">הוסף קבוצות שרירים</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        select
                        value={selectedMuscleGroup}
                        onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                        sx={{ minWidth: 200 }}
                        dir="rtl"
                    >
                        <MenuItem value="">בחר קבוצת שרירים</MenuItem>
                        {MUSCLE_GROUPS.map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddMuscleGroup}
                    >
                        הוסף
                    </Button>
                </Box>
            </Box>

            {muscleGroups.map((group) => (
                <Paper key={group} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {group}
                    </Typography>
                    <List>
                        {exercises[group]?.map((exercise, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={exercise.name}
                                    secondary={`${exercise.sets} סטים × ${exercise.reps} חזרות`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleRemoveExercise(group, index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleAddExercise(group)}
                    >
                        הוסף תרגיל
                    </Button>
                </Paper>
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={!workoutName || muscleGroups.length === 0}
                sx={{ mt: 2 }}
            >
                צור אימון
            </Button>
        </Box>
    );
};

export default CreateWorkout; 