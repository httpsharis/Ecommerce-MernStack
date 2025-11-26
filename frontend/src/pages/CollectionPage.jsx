import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Product/FilterSidebar';
import SortOptions from '../components/Product/SortOptions';
import ProductGrid from '../components/Product/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slice/productsSlice';
import { useSearchParams, useParams } from 'react-router';

function CollectionPage() {
    const dispatch = useDispatch();
    const { collection } = useParams();
    const { products, loading, error } = useSelector((state) => state.products);
    const [searchParams] = useSearchParams();
    const sidebarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        dispatch(fetchProductsByFilters({ ...params, collection }));
    }, [dispatch, searchParams, collection]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleClickOutside = (e) => {
        // close sidebar when click outside
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }
    }

    useEffect(() => {
        // Add Event Listener for clicks
        document.addEventListener("mousedown", handleClickOutside)

        // clean event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [])

    return (
        <div className='flex flex-col lg:flex-row'>
            {/* Mobile Filter Buttons */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden order p-2 flex justify-center items-center">
                <FaFilter className="mr-2" /> Filters
            </button>

            {/* Filter Sidebar */}
            <div
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duartion-300 lg:static lg:translate-x-0`}
                ref={sidebarRef}>
                <FilterSidebar />
            </div>
            <div className="grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collection</h2>

                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default CollectionPage