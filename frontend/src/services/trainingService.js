import axios from 'axios';

console.log('Window ENV:', window.ENV);
const API_URL = window.ENV?.API_URL || '/api';
console.log('Using API_URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const trainingService = {
    // Get all workouts
    getAllWorkouts: async () => {
        try {
            const response = await api.get('/workouts');
            return response.data;
        } catch (error) {
            console.error('Error in getAllWorkouts:', error);
            throw error;
        }
    },

    // Create a new workout
    createWorkout: async (workoutData) => {
        try {
            console.log('Creating workout with data:', workoutData);
            const response = await api.post('/workouts', workoutData);
            return response.data;
        } catch (error) {
            console.error('Error in createWorkout:', error);
            throw error;
        }
    },

    // Update workout progress
    updateExerciseProgress: async (workoutId, exerciseId, progressData) => {
        try {
            const response = await api.put(
                `/workouts/${workoutId}/exercises/${exerciseId}/progress`,
                progressData
            );
            return response.data;
        } catch (error) {
            console.error('Error in updateExerciseProgress:', error);
            throw error;
        }
    },

    // Get exercise history
    getExerciseHistory: async (exerciseId) => {
        try {
            const response = await api.get(`/exercises/${exerciseId}/history`);
            return response.data;
        } catch (error) {
            console.error('Error in getExerciseHistory:', error);
            throw error;
        }
    },

    // Get exercise history for weight progress chart
    getExerciseHistoryWeight: async (exerciseId) => {
        try {
            const response = await axios.get(`${API_URL}/exercises/${exerciseId}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching exercise history:', error);
            throw error;
        }
    },

    // Get scheduled workouts for calendar
    getScheduledWorkouts: async () => {
        try {
            const response = await axios.get(`${API_URL}/workouts/scheduled`);
            return response.data;
        } catch (error) {
            console.error('Error fetching scheduled workouts:', error);
            throw error;
        }
    },

    // Get workout statistics
    getWorkoutStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/workouts/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching workout statistics:', error);
            throw error;
        }
    }
};

export default trainingService; 