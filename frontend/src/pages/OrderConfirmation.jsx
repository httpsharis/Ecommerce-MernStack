import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function OrderConfirmation() {
    const navigate = useNavigate()
    const [orderData, setOrderData] = useState(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            const stored = sessionStorage.getItem('orderConfirmation');
            if (stored) {
                const parsed = JSON.parse(stored);
                setOrderData(parsed);
                sessionStorage.removeItem('orderConfirmation');
            }
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [])

    useEffect(() => {
        if (!isChecking && !orderData) {
            navigate('/profile', { replace: true }); // ✅ FIXED: Was '/order-confirmation', now '/'
        }
    }, [isChecking, orderData, navigate])

    if (isChecking || !orderData) {
        return <div className="max-w-4xl mx-auto py-10 px-6 text-center">Loading...</div>;
    }

    const { order, paymentData } = orderData;

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10)
        return orderDate.toLocaleDateString()
    }

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white min-h-screen'>
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank you for Your Order!
            </h1>

            <div className="p-6 rounded-lg border border-gray-300">
                <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
                        <p className="text-gray-500">
                            Order date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-emerald-700 text-sm">
                            Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
                        </p>
                    </div>
                </div>
                
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center mb-4 pb-4 border-b">
                            <img
                                src={item.image || 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className='w-16 h-16 object-cover rounded-md mr-4'
                            />
                            <div className="flex-1">
                                <h4 className="text-md font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-500">{item.color} | {item.size}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-md font-semibold">${item.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-50 p-4 rounded">
                        <h4 className="text-lg font-semibold mb-2">Payment</h4>
                        <p className="text-gray-600">{order.paymentMethod}</p>
                        <p className="text-sm text-emerald-600 mt-1">Status: Paid</p>
                        {paymentData && (
                            <p className="text-gray-500 text-sm mt-2">
                                {paymentData.cardNumber}<br />
                                {paymentData.cardName}
                            </p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                        <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                        <p className="text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">Total:</span>
                        <span className="text-2xl font-bold text-emerald-700">
                            ${order.totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    View My Orders
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    )
}

export default OrderConfirmation