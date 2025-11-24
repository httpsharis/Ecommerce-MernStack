import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Retrieve user from localStorage if available
const userFormStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

// Check for an existing guest ID in the Local Storage or generate a new one
const initialGuestId = localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;
localStorage.setItem('guestId', initialGuestId);

// Initial state
const initialState = {
    user: userFormStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            userData,
            { withCredentials: true } // ✅ Add this for cookies
        );
        
        console.log('Login response:', response.data); // ✅ Debug log
        
        // ✅ Check if response has the expected structure
        if (!response.data.user || !response.data.token) {
            throw new Error('Invalid response structure from server');
        }
        
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        return response.data; // return the entire response
    } catch (error) {
        console.error('Login error:', error); // ✅ Debug log
        return rejectWithValue(
            error.response?.data?.message || 
            error.message || 
            'Login failed'
        );
    }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            userData,
            { withCredentials: true }
        );
        
        console.log('Register response:', response.data);
        
        if (!response.data.user || !response.data.token) {
            throw new Error('Invalid response structure from server');
        }
        
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        return response.data;
    } catch (error) {
        console.error('Register error:', error);
        return rejectWithValue(
            error.response?.data?.message || 
            error.message || 
            'Registration failed'
        );
    }
});

// Slice 
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            localStorage.setItem('guestId', state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem('guestId', state.guestId);
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { logoutUser, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;