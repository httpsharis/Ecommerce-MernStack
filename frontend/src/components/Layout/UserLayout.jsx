import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router'

function UserLayout() {
  return (
    <>
        <Header />
        {/* Main Content */}
        <main>
          <Outlet /> 
        </main>
        <Footer />
    </>
  )
}

export default UserLayout