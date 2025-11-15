import { Link } from "react-router";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";


function Navbar() {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [navDrawerOpen, setNavDrawerOpen] = useState(false)

    const toggleNavDrawer = () =>{
        setNavDrawerOpen(!navDrawerOpen)
    }

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    return (
        <>
            <nav>
                <div className="container mx-auto flex items-center justify-between px-12 py-3">
                    {/* Left - Logo*/}
                    <div>
                        <Link to="/" className="text-2xl font-medium cursor-pointer">
                            Rabbit
                        </Link>
                    </div>

                    {/* Center - Nevigation Link */}
                    <div className="hidden md:flex space-x-6">
                        <Link
                            to="#"
                            className="text-gray-700 hover:text-black text-sm font-medium uppercase cursor-pointer"
                        >
                            Men
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-700 hover:text-black text-sm font-medium uppercase cursor-pointer"
                        >
                            Women
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-700 hover:text-black text-sm font-medium uppercase cursor-pointer"
                        >
                            Top Wear
                        </Link>
                        <Link
                            to="#"
                            className="text-gray-700 hover:text-black text-sm font-medium uppercase cursor-pointer"
                        >
                            Bottom Wear
                        </Link>
                    </div>

                    {/* Right - Search ETC... */}
                    <div className="flex items-center gap-4 cursor-pointer">
                        <Link to="/admin" className="block bg-black px-2 rounded text-sm text-white">Admin</Link>
                        <Link to="/profile" className="flex items-center space-x-4 cursor-pointer">
                            <HiOutlineUser className="w-6 h-6 text-gray-700 hover:text-black" />
                        </Link>
                        <button 
                        onClick={toggleCartDrawer}
                        className="relative hover:text-black cursor-pointer">
                            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
                            <span className="absolute bg-red-600 text-white text-xs rounded-full px-2 -top-1.5 ">4</span>
                        </button>

                        {/* Search */}
                        <SearchBar />

                        {/* Hamburger Button */}
                        <button 
                        onClick={toggleNavDrawer}
                        className="md:hidden">
                            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                </div>
            </nav>

            <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

            {/* Mobile Navigation */}
            <div className={`fixed top-0 left-0 w-3/4 sm-1/2 md:1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-end p-4">
                    <button onClick={toggleNavDrawer}>
                        <IoMdClose className="w-6 h-6 text-gray-600"  />
                    </button>

                </div>
                    <div className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Menu</h2>
                        <nav className="space-y-2">
                            <Link to='#' onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                                Men
                            </Link>
                            <Link to='#' onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                                Women
                            </Link>
                            <Link to='#' onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                                Top Wear
                            </Link>
                            <Link to='#' onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">
                                Bottom Wear
                            </Link>
                        </nav>
                    </div>
            </div>
        </>
    );
}

export default Navbar;
