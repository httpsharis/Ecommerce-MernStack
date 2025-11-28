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
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/my-orders`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/${orderId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        // Clear order state
        clearOrder: (state) => {
            state.order = null;
            state.error = null;
        },
        // Clear all orders
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
        // Clear error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ==================== FETCH USER ORDERS ====================
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || [];
                state.totalOrders = action.payload.totalOrders || action.payload.orders?.length || 0;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==================== FETCH ORDER DETAILS ====================
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrder, clearOrders, clearError } = orderSlice.actions;
export default orderSlice.reducer;