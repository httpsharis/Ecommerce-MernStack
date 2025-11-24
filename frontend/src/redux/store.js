import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import productReducer from './slice/productsSlice'
import cartReducer from './slice/cartSlice'
import checkoutReducer from './slice/checkoutSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
    },
});

export default store;