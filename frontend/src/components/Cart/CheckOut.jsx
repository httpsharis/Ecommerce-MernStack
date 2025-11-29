import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { createCheckout } from '../../redux/slice/checkoutSlice'
import { toast } from 'sonner'

function CheckOut() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cart } = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.auth)

    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!cart || !cart.products || cart.products.length === 0) {
            navigate("/")
        }
    }, [cart, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (cart.products.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);

        const checkoutData = {
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "Credit Card",
            totalPrice: cart.totalPrice,
        }

        try {
            const result = await dispatch(createCheckout(checkoutData)).unwrap();
            const checkout = result.checkout || result; // ✅ Handle both response formats
            
            toast.success('Checkout created! Proceeding to payment...');
            
            // ✅ Navigate to payment page with checkoutId
            navigate('/payment', {
                state: { 
                    checkoutId: checkout._id, // ✅ Use checkout._id not result._id
                    shippingAddress,
                    cart: cart // ✅ Pass cart data too
                }
            });
        } catch (err) {
            console.error("Failed to create checkout:", err);
            toast.error('Failed to create checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>

                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg mb-4">Contact Details</h3>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user ? user.email : ""}
                            disabled
                            className='w-full p-2 border rounded border-gray-300 bg-gray-100' 
                        />
                    </div>

                    <h3 className="text-lg mb-4">Delivery Address</h3>
                    
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
                        <label className='block text-gray-700'>Address</label>
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
                        <label className='block text-gray-700'>Country</label>
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
                        <label className='block text-gray-700'>Phone Number</label>
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
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Continue to Payment'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Section - Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="border-t border-gray-300 py-4 mb-4">
                    {cart && cart.products.map((product, index) => (
                        <div key={index} className="flex items-start justify-between py-2 border-b border-gray-300">
                            <div className="flex items-start">
                                <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4 rounded' />
                                <div>
                                    <h3 className="text-md font-medium">{product.name}</h3>
                                    <p className="text-gray-500 text-sm">Size: {product.size}</p>
                                    <p className="text-gray-500 text-sm">Color: {product.color}</p>
                                    <p className="text-gray-500 text-sm">Qty: {product.quantity}</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">${cart ? cart.totalPrice.toFixed(2) : '0.00'}</p>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-green-600 font-medium">Free</p>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-4">
                    <p>Total</p>
                    <p>${cart ? cart.totalPrice.toFixed(2) : '0.00'}</p>
                </div>
            </div>
        </div>
    )
}

export default CheckOut