import React from 'react'
import { IoMdClose } from "react-icons/io";
import CartContent from '../Cart/CartContent';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function CartDrawer({ drawerOpen, toggleCartDrawer }) {

    const { user, guestId } = useSelector((state) => state.auth)
    const { cart } = useSelector((state) => state.cart)
    const userId = user ? user?._id : null

    const navigate = useNavigate()

    const handleCheckout = () => {
        toggleCartDrawer()
        if (!user) {
            navigate("/login?redirect=/checkout")
        } else {
            navigate("/checkout")
        }
    }

    return (
        <div
            className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}
            w-full sm:w-1/2 md:w-120`}
        >
            {/* Close Button */}
            <div
                className="flex justify-end p-4">
                <button onClick={toggleCartDrawer}>
                    <IoMdClose className='w-6 h-6 text-gray-600' />
                </button>
            </div>

            {/* Cart contents with scrollable area */}
            <div className="grow p-4 over-y-auto ">
                <h2 className='text-xl font-semibold mb-4'>Your Cart</h2>
                {cart && cart?.products?.length > 0 ? (<CartContent cart={cart} userId={userId} guestId={guestId} />) : <p className='text-center text-gray-600'>Your cart is empty</p>}
            </div>

            <div className="p-4 bg-white sticky bottom-0">
                {cart && cart?.products?.length > 0 ? (
                    <button
                        onClick={handleCheckout}
                        className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 cursor-pointer'>
                        Checkout
                    </button>
                ) : (
                    <button
                        onClick={handleCheckout}
                        className='w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 cursor-pointer'>
                        Checkout
                    </button>
                )}
                <p className='text-[11px]  text-gray-500 mt-2 text-center'>Shipping, taxas, and discount codes calulated at checkout.</p>
            </div>
        </div>
    )
}

export default CartDrawer