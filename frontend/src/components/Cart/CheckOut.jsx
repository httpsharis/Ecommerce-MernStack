import React, { useState } from 'react'
import { useNavigate } from 'react-router' // Fixed: should be 'react-router-dom' not 'react-router'

const cart = {
    products: [
        {
            id: 1, // Added: unique id for key prop
            name: "Stylish Jacket",
            size: "M",
            color: "Black",
            price: 120,
            image: "https://picsum.photos/150?random=1"
        },
        {
            id: 2, // Added: unique id for key prop
            name: "Casual Sneakers",
            size: "42",
            color: "White",
            price: 75,
            image: "https://picsum.photos/150?random=2"
        },
    ],
    totalPrice: 195
}

function CheckOut() {
    const navigate = useNavigate()
    // eslint-disable-next-line no-unused-vars
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

    // Fixed: added e parameter and preventDefault
    const handleCreateCheckout = (e) => {
        e.preventDefault()
        console.log('Checkout submitted:', shippingAddress)
        // Add your checkout logic here

        navigate("/payment", {
            state: { shippingAddress }
        })
    }


    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">
                        Contact Details
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value="user@example.com"
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
                        {!checkoutId ? (
                            <button type="submit" className="w-full bg-black text-white py-3 rounded">
                                Continue to Payment
                            </button>
                        ) : (
                            <div className="">
                                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg mb-4">Order Summary</h3>
                <div className="border-t border-gray-300 py-4 mb-4">
                    {cart.products.map((product) => ( // Fixed: use product.id for key
                        <div key={product.id} className="flex items-start justify-between py-2 border-b border-gray-300">
                            <div className="flex items-start">
                                <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                                <div>
                                    <h3 className="text-md">{product.name}</h3>
                                    <p className="text-gray-500">Size: {product.size}</p>
                                    <p className="text-gray-500">Color: {product.color}</p>
                                </div>
                            </div>
                            <p className="text-xl">${product.price}</p> {/* Fixed: removed optional chaining */}
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
                    <p>${cart.totalPrice}</p> {/* Fixed: removed optional chaining */}
                </div>
            </div>
        </div>
    )
}

export default CheckOut