import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../../contexts/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
 const {user}=useAuth()
  return (
    <header className="sticky top-0 bg-[#1F2937] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="relative p-2 rounded-lg text-white transition-all duration-300 ease-in-out hover:text-gray-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring focus:ring-gray-500/50"
            aria-label="Toggle navigation"
          >
            <Menu size={28} className="transition-all duration-300 ease-in-out text-white" />
          </button>

          <Link
            to="/dashboard"
            className="text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-300"
          >
            Dashboard 
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ProfileDropdown user={user} />
        </div>
      </div>
    </header>
  );
};

export default Navbar; 