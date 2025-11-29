import { BrowserRouter, Routes, Route } from 'react-router';
import UserLayout from './components/Layout/UserLayout';
import Home from './pages/Home';
import { Toaster } from 'sonner'
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './components/Product/ProductDetails';
import CheckOut from './components/Cart/CheckOut';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentPage from './pages/PaymentPage';
import OrderDetails from './pages/OrderDetails';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './components/Admin/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProduct from './components/Admin/EditProduct';
import OrderManagement from './components/Admin/OrderManagement';

import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoutes from './components/Common/ProtectedRoutes';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path='/' element={<UserLayout />}>
            { /*User Layout*/}
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='collections/:collection' element={<CollectionPage />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='/checkout' element={<CheckOut />} />
            <Route path='/payment' element={<PaymentPage />} />
            <Route path='/order-confirmation' element={<OrderConfirmation />} />
            <Route path='/order/:id' element={<OrderDetails />} />
            <Route path='/my-orders' element={<MyOrdersPage />} />
          </Route>
          <Route path='/admin' element={<AdminLayout />}>
            { /*Admin Layout*/}
            <Route index element={
              <ProtectedRoutes role='admin'>
                <AdminHomePage />
              </ProtectedRoutes>} />
            <Route path='users' element={<UserManagement />} />
            <Route path='products' element={<ProductManagement />} />
            <Route path='products/:id/edit' element={<EditProduct />} />
            <Route path='orders' element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
