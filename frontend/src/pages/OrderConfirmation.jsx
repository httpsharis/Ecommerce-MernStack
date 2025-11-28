import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function OrderConfirmation() {
    const location = useLocation()
    const navigate = useNavigate()
    const { order } = location.state || {}

    useEffect(() => {
        if (!order) {
            navigate('/')
        }
    }, [order, navigate])

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10)
        return orderDate.toLocaleDateString()
    }

    if (!order) return null;

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white'>
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank you for Your Order!
            </h1>

            <div className="p-6 rounded-lg border border-gray-300">
                <div className="flex justify-between mb-20">
                    {/* Order ID and date */}
                    <div>
                        <h2 className="text-xl font-semibold">
                            Order ID: {order?._id}
                        </h2>
                        <p className="text-gray-500">
                            Order date: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    {/* Estimated Delivery */}
                    <div>
                        <p className="text-emerald-700 text-sm">
                            Estimated Delivery:{" "}
                            {order?.createdAt ? calculateEstimatedDelivery(order.createdAt) : 'N/A'}
                        </p>
                    </div>
                </div>
                {/* Order Items */}
                <div className="mb-20">
                    {order?.orderItems?.map((item, index) => (
                        <div
                            key={`${item.productId}-${index}`}
                            className="flex items-center mb-4">
                            <img
                                src={item.image || 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className='w-16 h-16 object-cover rounded-md mr-4'
                            />
                            <div>
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                    {item.color} | {item.size}
                                </p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="text-md">${item.price}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Payment and Delivery Info */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Payment Into */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Payment</h4>
                        <p className="text-gray-600">{order?.paymentMethod || 'Paypal'}</p>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                        <p className="text-gray-600">
                            {order?.shippingAddress?.address}
                        </p>
                        <p className="text-gray-600">{order?.shippingAddress?.city}, {" "} {order?.shippingAddress?.country}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/my-orders')}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    Checkout My Orders
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

export default OrderConfirmation