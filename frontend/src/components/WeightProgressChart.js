import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts';
import { Box, Typography, CircularProgress } from '@mui/material';
import trainingService from '../services/trainingService';

const WeightProgressChart = ({ exerciseId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const history = await trainingService.getExerciseHistory(exerciseId);
                const formattedData = history.map(h => ({
                    date: new Date(h.date),
                    weight: h.weight
                }));
                setData(formattedData);
            } catch (err) {
                setError('Failed to load exercise history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [exerciseId]);

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

    if (data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <Typography>No data available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: 300 }}>
            <LineChart
                dataset={data}
                xAxis={[{
                    dataKey: 'date',
                    scaleType: 'time',
                    valueFormatter: (date) => date.toLocaleDateString('he-IL')
                }]}
                yAxis={[{
                    dataKey: 'weight',
                    label: 'משקל (ק"ג)'
                }]}
                series={[{
                    dataKey: 'weight',
                    label: 'משקל',
                    color: '#1976d2'
                }]}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
            />
        </Box>
    );
};

export default WeightProgressChart; 