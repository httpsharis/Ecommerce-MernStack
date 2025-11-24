import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create checkout
export const createCheckout = createAsyncThunk(
    'checkout/createCheckout',
    async (checkoutData, { rejectWithValue }) => { // ✅ Fixed: was (checkoutdata, (rejectWithValue))
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // ✅ Fixed: was userToken
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Get checkout by ID
export const getCheckout = createAsyncThunk(
    'checkout/getCheckout',
    async (checkoutId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Pay for checkout
export const payCheckout = createAsyncThunk(
    'checkout/payCheckout',
    async ({ checkoutId, paymentData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                paymentData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Finalize checkout (convert to order)
export const finalizeCheckout = createAsyncThunk(
    'checkout/finalizeCheckout',
    async (checkoutId, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkout: null,
        loading: false,
        error: null,
        order: null, // Store the final order after checkout
    },
    reducers: {
        // Clear checkout state
        clearCheckout: (state) => {
            state.checkout = null;
            state.order = null;
            state.error = null;
        },
        // Reset error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => { // ✅ Fixed: was (building)
        builder
            // Create checkout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload.checkout;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get checkout
            .addCase(getCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload.checkout;
            })
            .addCase(getCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Pay checkout
            .addCase(payCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload.checkout;
            })
            .addCase(payCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Finalize checkout
            .addCase(finalizeCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizeCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
                state.checkout = null; // Clear checkout after finalizing
            })
            .addCase(finalizeCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { clearCheckout, clearError } = checkoutSlice.actions;
export default checkoutSlice.reducer;