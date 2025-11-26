import React from 'react'
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../redux/slice/cartSlice';

const CartContent = ({ cart, userId, guestId }) => {

    const dispatch = useDispatch();

    // Handle adding and removing from cart
    const handleAddToCart = (productId, delta, quantity, size, color) => {
        const newQuantity = quantity + delta
        if (newQuantity >= 1) {
            dispatch(updateCartItem({ productId, quantity: newQuantity, size, color, userId, guestId }))
        } else {
            dispatch(removeFromCart({ productId, size, color, userId, guestId }))
        }
    }

    const handleRemoveItem = (productId, size, color, userId, guestId) => {
        dispatch(removeFromCart({ productId, size, color, userId, guestId }))
    }

    return (
        <div>
            {
                cart.products?.map((product, index) => {
                    const productId = typeof product.productId === 'object' ? product.productId?._id : product.productId;
                    const name = product.name || product.productId?.name;
                    const image = product.image || product.productId?.images?.[0]?.url;
                    const price = product.price || product.productId?.price;

                    return (
                        <div key={index} className="flex items-start justify-between py-4 border-b border-gray-300">
                            <div className="flex items-start">
                                <img src={image} alt={name} className='object-cover rounded w-20 h-24 mr-4' />
                                <div className="text-sm text-gray-800">
                                    <h3 className='font-bold text-lg'>{name}</h3>
                                    <p>size: {product.size} | color: {product.color}</p>
                                    <div className="items-center flex mt-2">
                                        <button
                                            onClick={() => handleAddToCart(productId, 1, product.quantity, product.size, product.color)}
                                            className='border border-gray-300 rounded px-2 py-1 text-xl font-medium cursor-pointer'>+</button>
                                        <span className='mx-4'>{product.quantity}</span>
                                        <button
                                            onClick={() => handleAddToCart(productId, -1, product.quantity, product.size, product.color)}
                                            className='border border-gray-300 rounded px-2 py-1 text-xl font-medium cursor-pointer'>-</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p>$ {price?.toLocaleString()}</p>
                                <button onClick={() => handleRemoveItem(productId, product.size, product.color, userId, guestId)}>
                                    <RiDeleteBin3Line className='w-6 h-6 text-red-600' />
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CartContent