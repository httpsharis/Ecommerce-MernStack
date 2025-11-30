import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { fetchAllProducts, deleteProduct } from '../../redux/slice/adminSlice'
import { toast } from 'sonner'

function ProductManagement() {

    const dispatch = useDispatch()
    const { products = [], loading = false, error = null } = useSelector((state) => state.admin || {})

    useEffect(() => {
        dispatch(fetchAllProducts())
    }, [dispatch])

    // ✅ Debug - check what products we have
    console.log('🛍️ Products in state:', products)

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this Product?")) {
            try {
                const result = await dispatch(deleteProduct(id))
                
                if (result.type === 'admin/deleteProduct/fulfilled') {
                    toast.success('Product deleted successfully!')
                } else {
                    toast.error(result.payload || 'Failed to delete product')
                }
            } catch {
                toast.error('Failed to delete product')
            }
        }
    }

    if (loading) return <p className="text-center p-4">Loading products...</p>
    if (error) return <p className="text-center p-4 text-red-500">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">
                Product Management
            </h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className='min-w-full text-left text-gray-500'>
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">SKU</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products && products.length > 0 ? products.map((product) => (
                            <tr
                                key={product._id}
                                className='border-b border-gray-300 hover:bg-gray-50 cursor-pointer'
                            >
                                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                                <td className="p-4">${product.price}</td>
                                <td className="p-4">{product.sku || 'N/A'}</td>
                                <td className="p-4">
                                    <Link
                                        to={`/admin/products/${product._id}/edit`}
                                        className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600'
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className='p-4 text-center text-gray-500'>
                                    No Products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductManagement