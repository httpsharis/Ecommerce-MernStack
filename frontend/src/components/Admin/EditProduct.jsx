import React, { useState } from 'react'

function EditProduct() {
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
        images: [
            {
                url: "https://picsum.photos/150?random=1"
            },
            {
                url: "https://picsum.photos/150?random=2" // Fixed: different random number
            }
        ]
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handleImageUpload = (e) => {
        // Basic implementation for file upload
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProductData(prevData => ({
                    ...prevData,
                    images: [...prevData.images, { url: reader.result, altText: file.name }]
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Fixed: Added handleSubmit function
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Product Data:', productData)
        // Here you would send productData to your backend API
        alert('Product updated successfully!')
    }

    return (
        <div className='max-w-5xl mx-auto p-6 shadow-md rounded-md'>
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}> {/* Fixed: Added onSubmit */}
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
                        onChange={handleChange} // Fixed: Added onChange handler
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

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input
                        type="text"
                        name='sizes'
                        value={productData.sizes.join(",")}
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
                        value={productData.colors.join(",")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim()) // Fixed: changed 'sizes' to 'colors'
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
                        className='mb-2'
                    />
                    <div className="flex gap-4 mt-4 flex-wrap">
                        {productData.images.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className='w-20 h-20 object-cover rounded-md shadow-md'
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors'
                >
                    Update Product
                </button>
            </form>
        </div>
    )
}

export default EditProduct