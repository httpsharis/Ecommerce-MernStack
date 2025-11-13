import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Product/FilterSidebar';
import SortOptions from '../components/Product/SortOptions';
import ProductGrid from '../components/Product/ProductGrid';


function CollectionPage() {
    const [products, setProducts] = useState([])
    const sidebarRef = useRef(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

    useEffect(() => {
        setTimeout(() => {
            const fetchProducts = [
                {
                    _id: '1',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=1",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '2',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=2",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '3',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=3",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '4',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=4",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '5',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=5",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '6',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=6",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '7',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=7",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
                {
                    _id: '8',
                    name: 'Stylish Jacket',
                    price: 120,
                    imges: [
                        {
                            url: "https://picsum.photos/500/500?random=8",
                            altText: 'Stylish Jactet',
                        },
                    ],
                },
            ]

            setProducts(fetchProducts)
        }, 1000)
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
                <ProductGrid products={products} />
            </div>
        </div>
    )
}

export default CollectionPage