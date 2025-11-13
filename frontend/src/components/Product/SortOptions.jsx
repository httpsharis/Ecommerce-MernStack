import React from 'react'
import { useSearchParams } from 'react-router'

function SortOptions() {

    const [searchParams, setSearchParams] = useSearchParams()

    const handleSortChange = (e) => {
        const sortBy = e.target.value
        searchParams.set("sortBy", sortBy)
        setSearchParams(searchParams)
    }
    return (
        <div className='mb-4 flex items-center justify-end'>
            <select
                id="sort"
                onChange={handleSortChange}
                value={searchParams.get("sortBy") || ""}
                className='border border-gray-300 p-2 rounded-md foucs:outline.none'
            >
                <option value="Default">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="popularity">Popolarity</option>
            </select>
        </div>
    )
}

export default SortOptions

// So we are using set/get method here because we are using single value not the arrays.