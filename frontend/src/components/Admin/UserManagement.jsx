import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { addUser, deleteUser, fetchUsers, updateUserRole } from '../../redux/slice/adminSlice'
import { toast } from 'sonner'

function UserManagement() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth)
    const { users, loading, error } = useSelector((state) => state.admin)

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
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all fields')
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
                // ✅ Refresh users list
                dispatch(fetchUsers())
            } else {
                toast.error(result.payload || 'Failed to add user')
            }
        } catch (err) {
            toast.error('Failed to add user')
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            const result = await dispatch(updateUserRole({ userId, role: newRole })) // ✅ Fixed: userId not id

            if (result.type === 'admin/updateUserRole/fulfilled') {
                toast.success('User role updated!')
            } else {
                toast.error(result.payload || 'Failed to update role')
            }
        } catch (err) {
            toast.error('Failed to update role')
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const result = await dispatch(deleteUser(userId))

                if (result.type === 'admin/deleteUser/fulfilled') {
                    toast.success('User deleted successfully!')
                } else {
                    toast.error(result.payload || 'Failed to delete user')
                }
            } catch (err) {
                toast.error('Failed to delete user')
            }
        }
    }

    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {typeof error === 'object' ? JSON.stringify(error) : error}</p>}
            
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
                            className='w-full p-2 border border-gray-300 rounded'
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
                            className='w-full p-2 border border-gray-300 rounded'
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
                            className='w-full p-2 border border-gray-300 rounded'
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className='w-full p-2 border border-gray-300 rounded'
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50'
                    >
                        {loading ? 'Adding...' : 'Add User'}
                    </button>
                </form>
            </div>

            {/* User List Management */}
            <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
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
                                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{u.name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={u.role}
                                            className='p-2 border rounded border-gray-300'
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
            </div>
        </div>
    )
}

export default UserManagement