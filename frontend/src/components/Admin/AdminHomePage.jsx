import React, { useEffect } from 'react'
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts, fetchAllOrders } from '../../redux/slice/adminSlice'

function AdminHomePage() {
    const dispatch = useDispatch();
    
    const { products, orders, totalOrders, totalSales, loading, error } = useSelector((state) => state.admin || {
        products: [],
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null
    });

    useEffect(() => {
        dispatch(fetchAllProducts())
        dispatch(fetchAllOrders())
    }, [dispatch])

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-600">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 shadow-md rounded-lg bg-white">
                        <h2 className="text-xl font-semibold">Revenue</h2>
                        <p className="text-2xl font-bold text-green-600">${totalSales?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="p-4 shadow-md rounded-lg bg-white">
                        <h2 className="text-xl font-semibold">Total Orders</h2>
                        <p className="text-2xl font-bold">{totalOrders || 0}</p>
                        <Link to="/admin/orders" className='text-blue-500 hover:underline'>Manage Orders</Link>
                    </div>
                    <div className="p-4 shadow-md rounded-lg bg-white">
                        <h2 className="text-xl font-semibold">Total Products</h2>
                        <p className="text-2xl font-bold">{products?.length || 0}</p>
                        <Link to="/admin/products" className='text-blue-500 hover:underline'>Manage Products</Link>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">All Orders ({orders?.length || 0})</h2>
                    <Link to="/admin/orders" className="text-blue-500 hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className='min-w-full text-left text-gray-500'>
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Order ID</th>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Total Price</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.length > 0 ? (
                                orders.map((order) => ( // ✅ REMOVED .slice(0, 5) - Now shows ALL orders
                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                                        <td className="p-4">#{order._id.slice(-8)}</td>
                                        <td className="p-4">{order.user?.name || 'N/A'}</td>
                                        <td className="p-4 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {order.isPaid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage