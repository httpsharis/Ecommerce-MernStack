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

function App() {

  return (

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
          <Route path='order-confirmation' element={<OrderConfirmation />} />
        </Route>
        <Route>{ /*Admin Layout*/}</Route>
      </Routes>
    </BrowserRouter>

  )
}

export default App
