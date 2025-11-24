import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to load cart from local storage
const localCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : { products: [] }
}

// Helper function to save cart to local storage
const saveCartToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Initial state
const initialState = {
    cart: localCartFromStorage(),
    loading: false,
    error: null,
}

// Fetch the cart for user and guest 
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({ userId, guestId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: { userId, guestId },
                    withCredentials: true
                }
            )
            return response.data
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Add item to cart
export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
    }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    productId,
                    quantity,
                    size,
                    color,
                    guestId,
                    userId,
                },
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    productId,
                    quantity,
                    guestId,
                    userId,
                    size,
                    color,
                },
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Remove item from cart
export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
        try {
            const response = await axios({
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: { productId, guestId, userId, size, color },
                withCredentials: true
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Merge cart (when user logs in)
export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async ({ guestId, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                { guestId, userId },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Clear cart locally (for logout, etc.)
        clearCart: (state) => {
            state.cart = { products: [] };
            state.loading = false;
            state.error = null;
            localStorage.removeItem('cart');
        },
        // Add item locally (optimistic update)
        addItemLocally: (state, action) => {
            const { productId, quantity, size, color } = action.payload;
            const existingItem = state.cart.products.find(
                item => item.productId === productId && item.size === size && item.color === color
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.products.push(action.payload);
            }
            saveCartToStorage(state.cart);
        },
        // Remove item locally
        removeItemLocally: (state, action) => {
            const { productId, size, color } = action.payload;
            state.cart.products = state.cart.products.filter(
                item => !(item.productId === productId && item.size === size && item.color === color)
            );
            saveCartToStorage(state.cart);
        },
        // Update quantity locally
        updateQuantityLocally: (state, action) => {
            const { productId, quantity, size, color } = action.payload;
            const existingItem = state.cart.products.find(
                item => item.productId === productId && item.size === size && item.color === color
            );

            if (existingItem) {
                existingItem.quantity = quantity;
                saveCartToStorage(state.cart);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || { products: [] };
                saveCartToStorage(state.cart);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || { products: [] };
                saveCartToStorage(state.cart);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || { products: [] };
                saveCartToStorage(state.cart);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || { products: [] };
                saveCartToStorage(state.cart);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Merge cart
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.cart || { products: [] };
                saveCartToStorage(state.cart);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const {
    clearCart,
    addItemLocally,
    removeItemLocally,
    updateQuantityLocally
} = cartSlice.actions;

export default cartSlice.reducer;