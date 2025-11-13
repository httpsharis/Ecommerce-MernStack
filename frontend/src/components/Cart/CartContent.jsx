import React from 'react'
import { RiDeleteBin3Line } from "react-icons/ri";


const CartContent = () => {

    const cartProducts = [
        {
            productId: 1,
            name: 'T-shirt',
            size: 'M',
            color: 'Red',
            quantity: '1',
            price: '15',
            image: 'https://picsum.photos/200?random=1',
        },
        {
            productId: 2,
            name: 'Jeans',
            size: 'L',
            color: 'Blue',
            quantity: '1',
            price: '25',
            image: 'https://picsum.photos/200?random=2',
        },
    ]

    return (
        <div>
            {
                cartProducts.map((product, index) => (
                    <div key={index} className="flex items-start justify-between py-4 border-b border-gray-300">
                        <div className="flex items-start">
                            <img src={product.image} alt={product.name} className='object-cover rounded w-20 h-24 mr-4' />
                            <div className="text-sm text-gray-800">
                                <h3 className='font-bold text-lg'>{product.name}</h3>
                                <p>size: {product.size} | color: {product.color}</p>
                                <div className="items-center flex mt-2">
                                    <button className='border border-gray-300 rounded px-2 py-1 text-xl font-medium cursor-pointer'>+</button>
                                    <span className='mx-4'>{product.quantity}</span>
                                    <button className='border border-gray-300 rounded px-2 py-1 text-xl font-medium cursor-pointer'>-</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p>$ {product.price.toLocaleString()}</p>
                            <button>
                                <RiDeleteBin3Line className='w-6 h-6 text-red-600' />
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CartContent