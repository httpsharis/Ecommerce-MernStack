import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { addUser, deleteUser, fetchUsers, updateUserRole } from '../../redux/slice/adminSlice'
import { toast } from 'sonner'

function UserManagement() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth)
    // ✅ Fix: Add default values to prevent undefined errors
    const { users = [], loading = false, error = null } = useSelector((state) => state.admin || {})

    // ✅ Fetch users on component mount
    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/')
        }
    }, [user, navigate])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // ✅ Validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        // ✅ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email')
            return
        }

        // ✅ Password length validation
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        try {
            const result = await dispatch(addUser(formData))

            if (result.type === 'admin/addUser/fulfilled') {
                toast.success('User added successfully!')
                // Reset the form after submission
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "customer",
                })
            } else {
                toast.error(result.payload || 'Failed to add user')
            }
        } catch {  // ✅ Remove unused 'error' variable
            toast.error('Failed to add user')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        // ✅ Prevent changing own role
        if (user && user._id === userId) {
            toast.error("You cannot change your own role")
            return
        }

        try {
            const result = await dispatch(updateUserRole({ userId, role: newRole }))

            if (result.type === 'admin/updateUserRole/fulfilled') {
                toast.success('User role updated!')
                // ✅ Refresh users list to get latest data
                dispatch(fetchUsers())
            } else {
                toast.error(result.payload || 'Failed to update role')
            }
        } catch {
            toast.error('Failed to update role')
        }
    }

    const handleDeleteUser = async (userId) => {
        // ✅ Prevent deleting own account
        if (user && user._id === userId) {
            toast.error("You cannot delete your own account")
            return
        }

        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const result = await dispatch(deleteUser(userId))

                if (result.type === 'admin/deleteUser/fulfilled') {
                    toast.success('User deleted successfully!')
                } else {
                    toast.error(result.payload || 'Failed to delete user')
                }
            } catch {  // ✅ Remove unused 'err' variable
                toast.error('Failed to delete user')
            }
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            
            {/* ✅ Show error message properly */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {typeof error === 'object' ? JSON.stringify(error) : error}
                </div>
            )}
            
            {/* Add new User Form */}
            <div className="p-6 rounded-lg mb-6 bg-white shadow-md">
                <h3 className="text-lg font-bold mb-4">Add New User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500'
                            placeholder='Enter name'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500'
                            placeholder='Enter email'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500'
                            placeholder='Enter password (min 6 characters)'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500'
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </form>
            </div>

            {/* User List Management */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Loading users...</div>
                ) : (
                    <table className="min-w-full text-left text-gray-500">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-300 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                                            {u.name}
                                            {/* ✅ Show badge if current user */}
                                            {user && user._id === u._id && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                                            )}
                                        </td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={u.role}
                                                className='p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                disabled={user && user._id === u._id} // ✅ Disable for current user
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                disabled={user && user._id === u._id} // ✅ Disable for current user
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default UserManagement