import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { fetchProductDetails, updateProduct } from '../../redux/slice/adminSlice' // ✅ Removed unused uploadProductImage
import { toast } from 'sonner'
import axios from 'axios';

function EditProduct() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    
    const { selectedProduct, loading, error } = useSelector((state) => state.admin)

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        countInStock: "",
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        material: "",
        gender: "",
        images: []
    })

    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchProductDetails(id))
        }
    }, [dispatch, id])

    useEffect(() => {
        if (selectedProduct) {
            setProductData({
                name: selectedProduct.name || "",
                description: selectedProduct.description || "",
                price: selectedProduct.price || "",
                countInStock: selectedProduct.countInStock || "",
                sku: selectedProduct.sku || "",
                category: selectedProduct.category || "",
                brand: selectedProduct.brand || "",
                sizes: selectedProduct.sizes || [],
                colors: selectedProduct.colors || [],
                material: selectedProduct.material || "",
                gender: selectedProduct.gender || "",
                images: selectedProduct.images || []
            })
        }
    }, [selectedProduct])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append("image", file)

        try {
            setUploading(true)
            const token = localStorage.getItem('token')
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            
            setProductData((prevData) => ({
                ...prevData,
                images: [...prevData.images, { url: data.url, altText: "" }]
            }))
            
            toast.success('Image uploaded successfully!')
        } catch {  // ✅ Removed unused 'error' variable
            toast.error('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleRemoveImage = (index) => {
        setProductData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const result = await dispatch(updateProduct({ 
                productId: id, 
                productData 
            }))

            if (result.type === 'admin/updateProduct/fulfilled') {
                toast.success('Product updated successfully!')
                navigate('/admin/products')
            } else {
                toast.error(result.payload || 'Failed to update product')
            }
        } catch {  // ✅ Removed unused variable
            toast.error('Failed to update product')
        }
    }

    if (loading) return <p className="text-center p-6">Loading product...</p>
    if (error) return <p className="text-center p-6 text-red-500">Error: {error}</p>

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Product Name</label>
                    <input
                        type="text"
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className='block font-semibold mb-2'>Description</label>
                    <textarea
                        name='description'
                        value={productData.description}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        rows={4}
                        required
                    />
                </div>

                {/* Price Input */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input
                        type="number"
                        name='price'
                        value={productData.price}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>

                {/* Count In Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count in Stock</label>
                    <input
                        type="number"
                        name='countInStock'
                        value={productData.countInStock}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input
                        type="text"
                        name='sku'
                        value={productData.sku}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                        required
                    />
                </div>

                {/* Category */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Category</label>
                    <input
                        type="text"
                        name='category'
                        value={productData.category}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Brand */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Brand</label>
                    <input
                        type="text"
                        name='brand'
                        value={productData.brand}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Material */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Material</label>
                    <input
                        type="text"
                        name='material'
                        value={productData.material}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    />
                </div>

                {/* Gender */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Gender</label>
                    <select
                        name='gender'
                        value={productData.gender}
                        onChange={handleChange}
                        className='w-full border border-gray-300 rounded-md p-2'
                    >
                        <option value="">Select Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name='sizes'
                        value={Array.isArray(productData.sizes) ? productData.sizes.join(", ") : productData.sizes}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map((size) => size.trim())
                        })}
                        className='w-full border border-gray-300 rounded-md p-2'
                        placeholder="e.g., S, M, L, XL"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input
                        type="text"
                        name='colors'
                        value={Array.isArray(productData.colors) ? productData.colors.join(", ") : productData.colors}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim())
                        })}
                        className='w-full border border-gray-300 rounded-md p-2'
                        placeholder="e.g., Red, Blue, Black"
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className='mb-2'
                    />
                    {uploading && <p className="text-blue-500">Uploading...</p>}
                    
                    <div className="flex gap-4 mt-4 flex-wrap">
                        {productData.images && productData.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className='w-20 h-20 object-cover rounded-md shadow-md'
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className='flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50'
                    >
                        {loading ? 'Updating...' : 'Update Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className='flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProduct