import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router' // ✅ Fixed: added -dom
import { FiLock, FiCreditCard } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { payCheckout, finalizeCheckout } from '../redux/slice/checkoutSlice'
import { clearCart } from '../redux/slice/cartSlice'
import { toast } from 'sonner'

function PaymentPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { checkoutId, cart: checkoutCart } = location.state || {} // ✅ Get cart from location
    const { cart: reduxCart } = useSelector((state) => state.cart)
    const { user, guestId } = useSelector((state) => state.auth)

    // ✅ Use cart from location state if available, otherwise from redux
    const cart = checkoutCart || reduxCart;

    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        }
        
        if (name === 'expiryDate') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
        }
        
        setPaymentData(prev => ({
            ...prev,
            [name]: formattedValue
        }))
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!paymentData.cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required'
        } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card number must be 16 digits'
        }

        if (!paymentData.cardName.trim()) {
            newErrors.cardName = 'Cardholder name is required'
        }

        if (!paymentData.expiryDate.trim()) {
            newErrors.expiryDate = 'Expiry date is required'
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
            newErrors.expiryDate = 'Format: MM/YY'
        }

        if (!paymentData.cvv.trim()) {
            newErrors.cvv = 'CVV is required'
        } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
            newErrors.cvv = 'CVV must be 3-4 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return
        }

        if (!checkoutId) {
            toast.error('Checkout ID is missing. Please try again.');
            setErrors({ submit: 'Checkout ID is missing. Please try again.' })
            return;
        }

        setLoading(true)

        try {
            const toastId = toast.loading('Processing payment...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            // ✅ FIX: Send correct data format matching backend expectation
            await dispatch(payCheckout({
                checkoutId,
                paymentData: {
                    paymentStatus: "paid", // ✅ Backend expects this at root level
                    paymentDetails: { // ✅ Card details go inside paymentDetails
                        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
                        cardName: paymentData.cardName,
                        expiryDate: paymentData.expiryDate,
                        cvv: paymentData.cvv,
                    }
                }
            })).unwrap();

            const finalizeResult = await dispatch(finalizeCheckout(checkoutId)).unwrap();
            const order = finalizeResult.order || finalizeResult;

            await dispatch(clearCart({ userId: user?._id, guestId })).unwrap();

            sessionStorage.setItem('orderConfirmation', JSON.stringify({
                order: order,
                paymentData: {
                    cardNumber: `**** **** **** ${paymentData.cardNumber.replace(/\s/g, '').slice(-4)}`,
                    cardName: paymentData.cardName,
                }
            }));

            toast.dismiss(toastId);
            toast.success('Payment successful!');

            window.location.href = '/order-confirmation';

        } catch (err) {
            toast.dismiss();
            toast.error(err?.message || 'Payment failed. Please try again.');
            setErrors({ submit: err?.message || 'Payment failed. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    // ✅ Added: Check if cart exists and has products
    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                    <p className="font-semibold">Your cart is empty</p>
                    <p className="text-sm">Please add items to your cart before proceeding to payment.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!checkoutId) { // ✅ Check checkoutId
        return (
            <div className="max-w-4xl mx-auto py-10 px-6">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    <p className="font-semibold">Invalid checkout session</p>
                    <p className="text-sm">Please start the checkout process again.</p>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Go to Checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto py-10 px-6'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
                <p className="text-gray-600">Complete your purchase securely</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center mb-6">
                        <FiLock className="text-green-600 mr-2" size={24} />
                        <span className="text-sm text-gray-600">Secure Payment</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number
                            </label>
                            <div className="relative">
                                <input
                                    id="cardNumber"
                                    type="text"
                                    name="cardNumber"
                                    value={paymentData.cardNumber}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                />
                                <FiCreditCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            {errors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
                                Cardholder Name
                            </label>
                            <input
                                id="cardName"
                                type="text"
                                name="cardName"
                                value={paymentData.cardName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="John Doe"
                            />
                            {errors.cardName && (
                                <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    id="expiryDate"
                                    type="text"
                                    name="expiryDate"
                                    value={paymentData.expiryDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="MM/YY"
                                    maxLength="5"
                                />
                                {errors.expiryDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                    CVV
                                </label>
                                <input
                                    id="cvv"
                                    type="text"
                                    name="cvv"
                                    value={paymentData.cvv}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="123"
                                    maxLength="4"
                                />
                                {errors.cvv && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                                )}
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing Payment...' : `Pay $${cart.totalPrice?.toFixed(2) || '0.00'}`}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Your payment information is encrypted and secure
                        </p>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-4">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                        <div className="space-y-3 mb-4">
                            {cart.products.map((product) => (
                                <div key={`${product.productId}-${product.size}-${product.color}`} className="flex justify-between text-sm">
                                    <div className="flex-1">
                                        <p className="text-gray-700 font-medium">{product.name}</p>
                                        <p className="text-gray-500 text-xs">
                                            Size: {product.size} | Color: {product.color} | Qty: {product.quantity}
                                        </p>
                                    </div>
                                    <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>${cart.totalPrice?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage