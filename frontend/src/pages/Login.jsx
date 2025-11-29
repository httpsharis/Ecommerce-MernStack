import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'; // ✅ Fixed: combined imports
import login from './../assets/login.webp'
import { loginUser } from '../redux/slice/authSlice'
import { useDispatch, useSelector } from 'react-redux'; // ✅ Fixed: combined imports
import { mergeCart } from '../redux/slice/cartSlice';
import { toast } from 'sonner';

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error } = useSelector((state) => state.auth); // ✅ Added loading & error
    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter and check if its a checkout or something else
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate("/admin");
            } else if (cart?.products?.length > 0 && guestId) { // ✅ Fixed: removed double negative
                dispatch(mergeCart({ guestId, userId: user._id })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                })
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, isCheckoutRedirect, navigate, dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please enter email and password');
            return;
        }

        console.log('Login attempt with:', { email }); // ✅ Debug

        try {
            const result = await dispatch(loginUser({ email, password })).unwrap(); // ✅ Use unwrap()
            console.log('Login successful:', result);
            toast.success('Login successful!');
            // Navigation handled by useEffect
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err?.message || err || 'Login failed');
        }
    }

    return (
        <div className='flex'>
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12"> {/* ✅ Fixed: jusitfy-center */}
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">Rabbit</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hey there! 👋</h2>
                    <p className="text-center mb-6">
                        Enter your email and password to login
                    </p>
                    {error && ( // ✅ Show error
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-2 border rounded mb-4'
                            placeholder='Enter your Email'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className='block text-sm font-semibold mb-2'>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            className='w-full p-2 border rounded'
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <p className="mt-6 text-center text-sm">Don't have an account? {/* ✅ Fixed: accout */}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className='text-blue-500 ml-1'>
                            Register
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Side Image */}
            <div className="hidden md:block w-1/2 bg-gray-800 ">
                <div className="h-full flex flex-col justify-center items-center">
                    <img src={login} alt="Login to Account" className='h-[750px] w-full object-cover' /> {/* ✅ Fixed: w-ful */}
                </div>
            </div>
        </div>
    )
}

export default Login