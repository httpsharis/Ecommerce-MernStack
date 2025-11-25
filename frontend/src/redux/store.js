import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import productReducer from './slice/productsSlice'
import cartReducer from './slice/cartSlice'
import checkoutReducer from './slice/checkoutSlice'
import orderReducer from './slice/orderSlice'
import adminReducer from './slice/adminSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        order: orderReducer,
        admin: adminReducer,
    },
});

export default store;