import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus } from '../../redux/slice/adminSlice'
import { toast } from 'sonner'

function OrderManagement() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    const { orders = [], loading = false, error = null } = useSelector((state) => state.admin || {})

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        } else {
            dispatch(fetchAllOrders())
        }
    }, [dispatch, user, navigate])

    const handleStatusChange = async (orderId, status) => {
        try {
            const result = await dispatch(updateOrderStatus({ orderId, status }))
            
            if (result.type === 'admin/updateOrderStatus/fulfilled') {
                toast.success(`Order status updated to ${status}`)
            } else {
                toast.error(result.payload || 'Failed to update order status')
            }
        } catch {
            toast.error('Failed to update order status')
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>
    
    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">Order Management</h2>

            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Order ID</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Total Price</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer">
                                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                                        #{order._id.slice(-8)}
                                    </td>
                                    <td className='p-4'>
                                        {order.user?.name || 'N/A'}
                                    </td>
                                    <td className='p-4'>
                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className='p-4'>
                                        <select
                                            value={order.status || 'Processing'}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                            }
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() =>
                                                handleStatusChange(order._id, "Delivered")
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Mark as Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='p-4 text-center text-gray-500'>
                                    No Orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderManagement