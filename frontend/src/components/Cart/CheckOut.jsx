import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { createCheckout, payCheckout, finalizeCheckout } from '../../redux/slice/checkoutSlice'
import { clearCart } from '../../redux/slice/cartSlice'

function CheckOut() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cart } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)

    const [checkoutId, setCheckoutId] = useState(null)
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    })
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    })

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/")
        }
    }, [cart, navigate])

    const handleCreateCheckout = async (e) => {
        e.preventDefault()
        if (cart.products.length === 0) return;

        const checkoutData = {
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "Credit Card",
            totalPrice: cart.totalPrice,
        }

        try {
            const result = await dispatch(createCheckout(checkoutData)).unwrap();
            setCheckoutId(result._id)
        } catch (err) {
            console.error("Failed to create checkout:", err);
        }
    }

    const handlePaymentSuccess = async (e) => {
        e.preventDefault()

        try {
            await dispatch(payCheckout({
                checkoutId,
                paymentData: {
                    ...paymentData,
                    paymentMethod: "Credit Card",
                    paymentStatus: "paid"
                }
            })).unwrap();

            const result = await dispatch(finalizeCheckout(checkoutId)).unwrap();
            const order = result.order;

            dispatch(clearCart());

            navigate('/order-confirmation', {
                state: { order }
            })
        } catch (err) {
            console.error("Payment failed:", err)
        }
    }

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>

                {!checkoutId ? (
                    <form onSubmit={handleCreateCheckout}>
                        <h3 className="text-lg mb-4">
                            Contact Details
                        </h3>

                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={user ? user.email : ""}
                                disabled
                                className='w-full p-2 border rounded border-gray-300' />
                        </div>

                        <h3 className="text-lg mb-4">
                            Delivery
                        </h3>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded border-gray-300"
                                    value={shippingAddress.firstName}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        firstName: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded border-gray-300"
                                    value={shippingAddress.lastName}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        lastName: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className='block text-gray-700'>
                                Address
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.address}
                                className='w-full p-2 border rounded border-gray-300'
                                onChange={(e) => setShippingAddress({
                                    ...shippingAddress,
                                    address: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">City</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded border-gray-300"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Postal Code</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded border-gray-300"
                                    value={shippingAddress.postalCode}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        postalCode: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className='block text-gray-700'>
                                Country
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.country}
                                className='w-full p-2 border rounded border-gray-300'
                                onChange={(e) => setShippingAddress({
                                    ...shippingAddress,
                                    country: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className='block text-gray-700'>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={shippingAddress.phone}
                                className='w-full p-2 border rounded border-gray-300'
                                onChange={(e) => setShippingAddress({
                                    ...shippingAddress,
                                    phone: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="w-full bg-black text-white py-3 rounded">
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePaymentSuccess}>
                        <h3 className="text-lg mb-4">Payment Details</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentData.cardNumber}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border rounded border-gray-300"
                                required
                                maxLength="16"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Cardholder Name</label>
                            <input
                                type="text"
                                name="cardName"
                                value={paymentData.cardName}
                                onChange={handlePaymentChange}
                                className="w-full p-2 border rounded border-gray-300"
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={paymentData.expiryDate}
                                    onChange={handlePaymentChange}
                                    className="w-full p-2 border rounded border-gray-300"
                                    required
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={paymentData.cvv}
                                    onChange={handlePaymentChange}
                                    className="w-full p-2 border rounded border-gray-300"
                                    required
                                    maxLength="3"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors">
                            Pay Now
                        </button>
                    </form>
                )}
            </div>

            {/* Right Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t border-gray-300 py-4 mb-4">
                    {cart && cart.products.map((product, index) => (
                        <div key={index} className="flex items-start justify-between py-2 border-b border-gray-300">
                            <div className="flex items-start">
                                <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">${product.price}</p>
                        </div>
                    ))}
                </div>
                {/* Cart Total Price */}
                <div className="flex justify-between items-center text-lg">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                <div className="flex justify-between text-lg mt-4 border-t border-gray-300 pt-4">
                    <p>Total</p>
                    <p>${cart ? cart.totalPrice : 0}</p>
                </div>
            </div>
        </div>
    )
}

export default CheckOut