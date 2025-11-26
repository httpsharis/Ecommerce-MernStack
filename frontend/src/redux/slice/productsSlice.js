import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Async Thunk to fetch the products by Collection and Optional Filters
export const fetchProductsByFilters = createAsyncThunk(
    'products/fetchByFilters',
    async ({
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    }) => {
        const query = new URLSearchParams();
        if (collection) query.append("collection", collection)
        if (size) query.append("size", size)
        if (color) query.append("color", color)
        if (gender) query.append("gender", gender)
        if (minPrice) query.append("minPrice", minPrice)
        if (maxPrice) query.append("maxPrice", maxPrice)
        if (sortBy) query.append("sortBy", sortBy)
        if (search) query.append("search", search)
        if (category) query.append("category", category)
        if (material) query.append("material", material)
        if (brand) query.append("brand", brand)
        if (limit) query.append("limit", limit)

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`)
        return response.data;
    })

// ASYNC Thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductDetails",
    async (id, { rejectWithValue }) => { // ✅ Added rejectWithValue for error handling
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
            );
            console.log('Product details response:', response.data); // ✅ Debug log
            return response.data.product || response.data; // ✅ Handle both formats
        } catch (error) {
            console.error('Error fetching product:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async Thunk to update product
export const updateProduct = createAsyncThunk(
    'product/updateProducts',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, 
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ Fixed: was "userToken"
                    },
                }
            )
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// Async Thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
    'products/fetchSimilarProducts',
    async ({ id, category, gender }, { rejectWithValue }) => { // ✅ Fixed: need category/gender for similar products
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`, // ✅ Fixed: use similar endpoint
            )
            console.log('Similar products response:', response.data); // ✅ Debug log
            return response.data.products || response.data; // ✅ Handle both formats
        } catch (error) {
            console.error('Error fetching similar products:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        selectedProduct: null,
        similarProducts: [],
        loading: false,
        error: null,
        filters: {
            collection: "",
            size: "",
            color: "",
            gender: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "",
            search: "",
            category: "",
            material: "",
            brand: "",
            limit: "",
        }
    },
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearState: (state) => {
            state.filters = {
                collection: "",
                size: "",
                color: "",
                gender: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                category: "",
                material: "",
                brand: "",
                limit: "",
            }
        },
        clearSelectedProduct: (state) => { // ✅ Added: clear product when navigating away
            state.selectedProduct = null;
            state.similarProducts = [];
        }
    },
    extraReducers: (builder) => {
        builder
        // handle fetching products with filters
        .addCase(fetchProductsByFilters.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products || action.payload || []; // ✅ Handle both formats
        })
        .addCase(fetchProductsByFilters.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error?.message || 'Failed to fetch products';
            state.products = [];
        })

        // Handle fetching single product details
        .addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error?.message || 'Failed to fetch product details';
            state.selectedProduct = null; // ✅ Clear on error
        })

        // Handle Updating Product 
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const updatedProduct = action.payload.product || action.payload; // ✅ Handle both formats
            const index = state.products.findIndex(
                (product) => product._id === updatedProduct._id
            )
            if (index !== -1) {
                state.products[index] = updatedProduct
            }
            if (state.selectedProduct?._id === updatedProduct._id) { // ✅ Update selected product too
                state.selectedProduct = updatedProduct;
            }
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error?.message || 'Failed to update product';
        })

        // Similar Products
        .addCase(fetchSimilarProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.similarProducts = action.payload || [];
        })
        .addCase(fetchSimilarProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error?.message || 'Failed to fetch similar products';
            state.similarProducts = []; // ✅ Clear on error
        });
    },
})

export default productSlice.reducer;
export const { setFilters, clearState, clearSelectedProduct } = productSlice.actions;