import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
    users: [],
    user: null,
    products: [],
    selectedProduct: null, // ✅ Add this for edit product
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
};

// ==================== USER MANAGEMENT ====================

// Fetch all users (admin)
export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create User action
export const addUser = createAsyncThunk(
    'admin/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
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

// Update user role (admin)
export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ userId, role }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
                { role },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            console.log('✅ Update response:', response.data); // Debug
            // ✅ Return the user object directly
            return response.data.user || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete user (admin)
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return { userId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ==================== PRODUCT MANAGEMENT ====================

export const fetchAllProducts = createAsyncThunk(
    'admin/fetchAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ✅ ADD THIS - Fetch single product details
export const fetchProductDetails = createAsyncThunk(
    'admin/fetchProductDetails',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ✅ ADD THIS - Update product
export const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async ({ productId, productData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${productId}`,
                productData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
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

// ✅ ADD THIS - Upload product image
export const uploadProductImage = createAsyncThunk(
    'admin/uploadProductImage',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete product (admin)
export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${productId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return { productId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ==================== ORDER MANAGEMENT ====================

export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${orderId}`,
                { status },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data.order || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Admin slice
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedProduct: (state) => { // ✅ Add this
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ==================== FETCH USERS ====================
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.users = action.payload;
                } else if (action.payload.users) {
                    state.users = action.payload.users;
                } else {
                    state.users = [];
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== ADD USER ====================
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user) {
                    state.users.push(action.payload.user);
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== UPDATE USER ROLE ====================
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                // ✅ Fixed: Get user from payload correctly
                const updatedUser = action.payload;
                if (updatedUser && updatedUser._id) {
                    const index = state.users.findIndex(u => u._id === updatedUser._id);
                    if (index !== -1) {
                        state.users[index] = {
                            ...state.users[index],
                            ...updatedUser
                        };
                    }
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== DELETE USER ====================
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(u => u._id !== action.payload.userId);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== FETCH ALL PRODUCTS ====================
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                console.log('📥 Products payload:', action.payload); // ✅ Debug
                
                // ✅ Handle different response formats
                if (Array.isArray(action.payload)) {
                    state.products = action.payload;
                } else if (action.payload.products) {
                    state.products = action.payload.products;
                } else if (action.payload.data) {
                    state.products = action.payload.data;
                } else {
                    state.products = [];
                }
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== FETCH PRODUCT DETAILS ====================
            .addCase(fetchProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload.product || action.payload;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== UPDATE PRODUCT ====================
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload.product || action.payload;
                if (updatedProduct && updatedProduct._id) {
                    const index = state.products.findIndex(p => p._id === updatedProduct._id);
                    if (index !== -1) {
                        state.products[index] = updatedProduct;
                    }
                    state.selectedProduct = updatedProduct;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== UPLOAD PRODUCT IMAGE ====================
            .addCase(uploadProductImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadProductImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(uploadProductImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== FETCH ALL ORDERS ====================
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.orders = action.payload;
                    state.totalOrders = action.payload.length;
                    state.totalSales = action.payload.reduce((sum, order) => {
                        return order.isPaid ? sum + (order.totalPrice || 0) : sum;
                    }, 0);
                } else if (action.payload.orders) {
                    state.orders = action.payload.orders;
                    state.totalOrders = action.payload.totalOrders || action.payload.orders.length;
                    state.totalSales = action.payload.totalSales || 0;
                } else {
                    state.orders = [];
                }
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ✅ ADD THIS - UPDATE ORDER STATUS
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                if (updatedOrder && updatedOrder._id) {
                    const index = state.orders.findIndex(o => o._id === updatedOrder._id);
                    if (index !== -1) {
                        state.orders[index] = {
                            ...state.orders[index],
                            ...updatedOrder
                        };
                    }
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ==================== DELETE PRODUCT ====================
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p._id !== action.payload.productId);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSelectedProduct } = adminSlice.actions;
export default adminSlice.reducer;