import React from 'react'
import { useSelector } from 'react-redux'

function ProtectedRoutes({ children, role }) {

    const { user } = useSelector((state) => state.auth)

    if (!user || (role && user.role !== role)) {
        return <Navigate to='/' replace />
    }
    return children
}

export default ProtectedRoutes