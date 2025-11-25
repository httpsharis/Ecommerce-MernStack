import React, { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router'
import axios from 'axios'

function NewArivals() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const [newArrivals, setNewArrivals] = useState([])

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data)
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewArrivals()
    }, [])

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    }

    const scroll = (direction) => {
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current?.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        })
    }

    const updateScrollButton = () => {
        const container = scrollRef.current;
        if (!container) return;

        const leftScroll = container.scrollLeft;
        const rightScrollable = container.scrollWidth > (leftScroll + container.clientWidth + 10); // Added small buffer

        setCanScrollLeft(leftScroll > 0);
        setCanScrollRight(rightScrollable);
    }


    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButton);
            updateScrollButton();

            return () => container.removeEventListener('scroll', updateScrollButton);
        }
    }, [newArrivals]);

    return (
        <section className='py-16 px-12 lg:px-12'>
            <div className='mx-auto container text-center mb-10 relative'>
                <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
                <p className='text-lg text-gray-600 mb-8'>
                    Discover the latest styles straight off the runway, freshy added to kepp you wardrobe on the cutting edge of fashion.
                </p>

                {/* Scroll buttons */}
                <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border transition-all ${canScrollLeft
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronLeft className='text-2xl' />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border transition-all ${canScrollRight
                            ? "bg-white text-black hover:bg-gray-100"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FiChevronRight className='text-2xl' />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className={`container mx-auto px-6 overflow-x-auto scrollbar-hide scroll-smooth no-scrollbar user-select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex gap-6 pb-8">
                    {newArrivals.map((product) => (
                        <div
                            key={product._id}
                            className='flex-none w-[280px] relative group'
                            onMouseDown={(e) => {
                                if (isDragging) {
                                    e.preventDefault()
                                }
                            }}
                        >
                            <div className="aspect-3/4 overflow-hidden rounded-lg select-none">
                                <img
                                    src={product.images?.[0]?.url || '.placeholder-image.jpg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    draggable='false'
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm text-white p-4 rounded-b-lg">
                                <Link
                                    to={`/product/${product._id}`}
                                    className='block hover:opacity-75 transition-opacity'
                                    onClick={(e) => {
                                        if (isDragging) {
                                            e.preventDefault()
                                        }
                                    }}
                                >
                                    <h4 className='font-medium text-lg'>{product.name}</h4>
                                    <p className='mt-1 text-white/90'>${product.price}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NewArivals