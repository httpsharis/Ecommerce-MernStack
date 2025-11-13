import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

// FilterSidebar: Sidebar for selecting product filters, syncs with URL query params
function FilterSidebar() {
    // useSearchParams: Lets you read and update URL query parameters (after '?')
    // useNavigate: Lets you change the URL programmatically
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    // filters state: Stores all selected filter values
    // Arrays for multi-select filters (size, material, brand), strings for single-select
    const [filters, setFilters] = useState({
        category: '',
        gender: '',
        color: '',
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    })

    // priceRange state: Used for the price slider UI (not yet wired to filters)
    const [priceRange, setPriceRange] = useState([0, 100])

    // Filter options (arrays): Used to render filter choices in the sidebar
    const categories = ["Top Wear", "Bottom Wear"]
    const colors = [
        "Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige", "Navy",
    ]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const materials = [
        "Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece",
    ]
    const brands = [
        "Urban Threads", "Modern Fit", "Street Style", "Beach Breeze", "Fastionista", "ChicStyle",
    ]
    const genders = ["Men", "Women"]

    // useEffect: Syncs filters state with URL query parameters whenever they change
    // Reads params from the URL, splits comma-separated values into arrays for multi-select filters
    useEffect(() => {
        const params = Object.fromEntries([...searchParams])
        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        })
    }, [searchParams])

    // handleFilterChange: Handles changes to filter inputs (checkbox, radio, button)
    // Updates filters state and syncs changes to the URL
    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target
        let newFilters = { ...filters };

        // For checkboxes: add/remove value from array
        if (type === "checkbox") {
            if (checked) {
                // Add value to array for this filter
                newFilters[name] = [...(newFilters[name] || []), value]
            } else {
                // Remove value from array for this filter
                newFilters[name] = newFilters[name].filter((item) => item !== value)
            }
        }
        // For radio buttons and color buttons, you should handle single value selection here (not shown)
        if (type === "radio") {
            newFilters[name] = value
        }

        if (type === "color") {
            newFilters[name] = value
        }
        setFilters(newFilters)
        updateURLParams(newFilters)
    }

    // function to handle price change
    const handlePriceChange = (e) => {
        const newPrice = e.target.value
        setPriceRange(0, newPrice)
        const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice }
        setFilters(filters)
        updateURLParams(newFilters)
    }

    // updateURLParams: Updates the URL query parameters to match the current filters
    // Converts arrays to comma-separated strings for the URL
    // Only adds filters that have a value
    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                // For arrays, join values with commas (e.g. size=M,L)
                params.append(key, newFilters[key].join(","))
            } else if (newFilters[key]) {
                // For single values, add as is
                params.append(key, newFilters[key])
            }
        })
        setSearchParams(params)
        navigate(`?${params.toString()}`)
    }

    return (
        <div className='p-4'>
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filters</h3>

            {/* Category Filters (single-select, radio) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label>
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1">
                        <input
                            type="radio"
                            value={category}
                            onChange={handleFilterChange}
                            checked={filters.category === category}
                            name="category"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender Filters (single-select, radio) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender</label>
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-1">
                        <input
                            type="radio"
                            value={gender}
                            onChange={handleFilterChange}
                            checked={filters.gender === gender}
                            name="gender"
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Color Filters (single-select, button) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            name='color'
                            value={color}
                            onClick={handleFilterChange}
                            className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.color === color ? "ring-2 ring-blue-500" : ""}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                        >
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Filters (multi-select, checkbox) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Size</label>
                {sizes.map((size) => (
                    <div key={size} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="size"
                            value={size}
                            onChange={handleFilterChange}
                            checked={filters.size.includes(size)} // Checks if the current Size is present in the array. Changes accordingly if check or not 
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{size}</span>
                    </div>
                ))}
            </div>

            {/* Material Filters (multi-select, checkbox) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Materials</label>
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="material"
                            value={material}
                            onChange={handleFilterChange}
                            checked={filters.material.includes(material)}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>

            {/* Brand Filters (multi-select, checkbox) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Brands</label>
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center mb-1">
                        <input
                            type="checkbox"
                            name="brand"
                            value={brand}
                            onChange={handleFilterChange}
                            checked={filters.brand.includes(brand)}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>

            {/* Price Range Filter (slider, not yet wired to filters) */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Price Range</label>
                <input
                    type="range"
                    min={0}
                    max={100}
                    name="priceRange"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className='w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer' />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar