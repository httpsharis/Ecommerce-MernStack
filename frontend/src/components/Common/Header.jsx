import Navbar from './Navbar'
import Topbar from '../Layout/Topbar'

function Header() {
  return (
    <header className='border-b-2 border-gray-100'>
      {/* Topbar */}
      <Topbar />
      {/* navBar */}
      <Navbar />
      {/* Cart Drawer */}
    </header>
  )
}

export default Header