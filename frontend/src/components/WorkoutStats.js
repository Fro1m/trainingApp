import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import trainingService from '../services/trainingService';

const StatCard = ({ title, value, subtitle }) => (
    <Card>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" component="div">
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const WorkoutStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await trainingService.getWorkoutStats();
                setStats(data);
            } catch (err) {
                setError('Failed to load workout statistics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="סה״כ אימונים"
                        value={stats.totalWorkouts}
                        subtitle="מאז תחילת התוכנית"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="אימונים השבוע"
                        value={stats.thisWeek}
                        subtitle="בשבוע האחרון"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="אימונים החודש"
                        value={stats.thisMonth}
                        subtitle="בחודש האחרון"
                    />
                </Grid>
            </Grid>

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        תרגיל הכי פופולרי
                    </Typography>
                    <Typography variant="h5">
                        {stats.mostFrequentExercise}
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        שיאים אישיים
                    </Typography>
                    {stats.personalBests.map((pb, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                                {pb.exercise}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(pb.current / pb.record) * 100}
                                    />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {pb.current} / {pb.record} ק"ג
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
};

export default WorkoutStats; 