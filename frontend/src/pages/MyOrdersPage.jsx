import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchUserOrders } from '../redux/slice/orderSlice'

function MyOrdersPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector((state) => state.order)

    useEffect(() => {
        dispatch(fetchUserOrders())
    }, [dispatch])

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`)
    }

    if (loading) {
        return (
            <div className='w-full p-4 sm:p-6 flex justify-center items-center min-h-[300px]'>
                <p className="text-lg">Loading your orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='w-full p-4 sm:p-6'>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="font-semibold">Error loading orders</p>
                    <p className="text-sm">{typeof error === 'object' ? JSON.stringify(error) : error}</p>
                    <button 
                        onClick={() => dispatch(fetchUserOrders())}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full p-4 sm:p-6'>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
                My Orders
            </h2>

            <div className="w-full shadow-md rounded-lg overflow-x-auto">
                <table className='w-full text-left text-gray-500'>
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className='py-2 px-4 sm:py-3'>Image</th>
                            <th className='py-2 px-4 sm:py-3'>Order ID</th>
                            <th className='py-2 px-4 sm:py-3'>Created</th>
                            <th className='py-2 px-4 sm:py-3'>Shipping Address</th>
                            <th className='py-2 px-4 sm:py-3'>Items</th>
                            <th className='py-2 px-4 sm:py-3'>Price</th>
                            <th className='py-2 px-4 sm:py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    onClick={() => handleRowClick(order._id)}
                                    className='border-b hover:bg-gray-50 cursor-pointer transition-colors'
                                >
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        <img
                                            src={order.orderItems?.[0]?.image || 'https://via.placeholder.com/150'}
                                            alt={order.orderItems?.[0]?.name || 'Product'}
                                            className='w-10 h-10 sm:w-12 sm:h-12 rounded object-cover'
                                        />
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">
                                        #{order._id.slice(-8)}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-xs sm:text-sm">
                                        {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 text-center">
                                        {order.orderItems?.length || 0}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4 font-semibold text-gray-900">
                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="py-2 px-2 sm:py-4 sm:px-4">
                                        <span className={`${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-2 sm:px-3 py-1 rounded-full text-xs font-medium`}>
                                            {order.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-8 px-4 text-center text-gray-500">
                                    <p className="text-lg mb-2">You have no orders yet</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Start Shopping
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyOrdersPage