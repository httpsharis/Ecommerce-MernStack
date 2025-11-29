import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
    orders: [],
    order: null,
    totalOrders: 0,
    loading: false,
    error: null,
}

// Get my orders
export const fetchUserOrders = createAsyncThunk(
    'order/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                return rejectWithValue('No authentication token found. Please login again.');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/myorders`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get single order by ID
export const fetchOrderDetails = createAsyncThunk(
    'order/fetchOrderDetails',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                return rejectWithValue('No authentication token found. Please login again.');
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/${orderId}`,
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Order slice
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.order = null;
            state.error = null;
        },
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.orders) {
                    state.orders = action.payload.orders;
                } else if (Array.isArray(action.payload)) {
                    state.orders = action.payload;
                } else {
                    state.orders = [];
                }
                state.totalOrders = state.orders.length;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.orders = [];
            })
            // Fetch order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order || action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrder, clearOrders, clearError } = orderSlice.actions;
export default orderSlice.reducer;