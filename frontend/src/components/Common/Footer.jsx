import { Link } from 'react-router'
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";


function Footer() {
    return (
        <footer className='border-t border-t-gray-200 py-12'>
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-12 mb-4">
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                        Newsletter
                    </h3>
                    <p className='text-gray-500 mb-4'>Be the first to hear about new products, exclusive events, and online offers.</p>
                    <p className='text-gray-600 font-medium text-sm mb-4'>Sign up and get 10% off on your first order.</p>

                    {/* Newsletter form */}
                    <form className='flex'>
                        <input
                            type="email"
                            placeholder='Enter your email'
                            className='p-3 text-sm border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent'
                            required
                        />
                        <button
                            type="submit"
                            className='w-full sm:w-auto bg-gray-900 text-white px-3 py-3 rounded-md  sm:rounded-l-none hover:bg-gray-700 transition-all duration-200'
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Shop Links */}
                <div className='ml-3'>
                    <h3 className='text-lg font-medium text-gray-800 mb-4'>Shops</h3>
                    <ul className='text-sm text-gray-600 space-y-4'>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Men's top Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Women's top Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Men's bottom Wear
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Women's bottom Wear
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className='ml-3'>
                    <h3 className='text-lg font-medium text-gray-800 mb-4'>Support</h3>
                    <ul className='text-sm text-gray-600 space-y-4'>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Contact us
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                About us
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="hover:text-gray-500 transition-colors">
                                Features
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>
                        Follow Us
                    </h3>

                    <div className='flex items-center space-x-4 mb-6'>
                        <a 
                        href="www.facebook.com" 
                        target='_blank' 
                        rel='noopener noreferer'
                        className='hover:text-gray-300'
                        >
                            <TbBrandMeta className='h-5 w-5' />
                        </a>
                        <a 
                        href="www.facebook.com" 
                        target='_blank' 
                        rel='noopener noreferer'
                        className='hover:text-gray-300'
                        >
                            <IoLogoInstagram className='h-5 w-5' />
                        </a>
                        <a 
                        href="www.facebook.com" 
                        target='_blank' 
                        rel='noopener noreferer'
                        className='hover:text-gray-300'
                        >
                            <RiTwitterXLine className='h-5 w-5' />
                        </a>
                    </div>

                    <p className='text-gray-500'>
                        Call Us
                    </p>
                    <p>
                        <FiPhoneCall className='inline-block mr-2' />
                        0123-456-789
                    </p>
                </div>
            </div>
            
            {/* Footer Bottom */}
            <div className='container mx-auto px-2 lg:px-0 border-t border-gray-200 pt-6'>
                <p className='text-gray-500 text-sm tracking-tighter text-center'>
                    © 2025, All Right Reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer