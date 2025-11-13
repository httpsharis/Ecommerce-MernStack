import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";

function Topbar() {
  return (
    <div className="bg-black text-white px-12">
      <div className="container mx-auto flex items-center justify-between py-3">
        
        {/* Left Side - All the social Apps Links */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-400" aria-label="Meta">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="Instagram">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="Twitter">
            <RiTwitterXLine className="h-5 w-5" />
          </a>
        </div>

        {/* Center - Tag Line */}
        <div className="text-sm text-center grow">
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>

        {/* Right - Phone Number */}
        <div className="text-sm hidden md:block"> 
          <a href='tell:+1234567890' className="hover:text-gray-400">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
}

export default Topbar;

// A Top bar with a center text Social Icons and on right there is the dummy phone number.
