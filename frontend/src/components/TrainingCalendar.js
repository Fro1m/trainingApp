import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import heLocale from 'date-fns/locale/he';
import trainingService from '../services/trainingService';

const TrainingCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const workouts = await trainingService.getScheduledWorkouts();
                setEvents(workouts.map(w => ({
                    ...w,
                    date: new Date(w.scheduledDate)
                })));
            } catch (err) {
                setError('Failed to load scheduled workouts');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const getEventsForDate = (date) => {
        return events.filter(event => 
            event.date.toDateString() === date.toDateString()
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={heLocale}>
                <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    sx={{
                        '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        },
                    }}
                />
            </LocalizationProvider>

            <Paper sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    אימונים ליום {selectedDate.toLocaleDateString('he-IL')}
                </Typography>
                {getEventsForDate(selectedDate).length === 0 ? (
                    <Typography>אין אימונים מתוכננים ליום זה</Typography>
                ) : (
                    getEventsForDate(selectedDate).map((event, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                            <Typography>
                                {event.name} - {event.date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    ))
                )}
            </Paper>
        </Box>
    );
};

export default TrainingCalendar; 