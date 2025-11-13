import React from 'react'
import womenCollectionImage from './../../assets/womens-collection.webp'
import menCollectionImage from './../../assets/mens-collection.webp'
import { Link } from 'react-router'

function GenderCollectionSection() {
    return (
        <section className='py-10 px-12 lg:px-12'>
            <div className="container mx-auto flex flex-col md:flex-row gap-8">
                {/* Women Collection */}
                <div className="relative flex-1">
                    <img
                        src={womenCollectionImage}
                        alt="Women Collection"
                        className='w-full h-[700px] object-cover'
                    />
                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>Women's Collection</h2>
                        <Link
                            to='/collection/all?gender=Women' 
                            className='text-gray-900 underline'>
                            Shop Now
                        </Link> 
                    </div>
                </div>

                {/* Men Collection */}
                <div className="relative flex-1">
                    <img
                        src={menCollectionImage}
                        alt="Women Collection"
                        className='w-full h-[700px] object-cover'
                    />
                    <div className="absolute bottom-8 left-8 bg-white/90 p-4">
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>Women's Collection</h2>
                        <Link
                            to='/collection/all?gender=Women' 
                            className='text-gray-900 underline'>
                            Shop Now
                        </Link> 
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GenderCollectionSection