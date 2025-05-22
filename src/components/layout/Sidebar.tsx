import React from "react";
import { Link } from "react-router-dom";
import { 
  X, 
  LayoutDashboard, 
  Building, 
  UserPlus
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Nav Header - Close button */}
        <div className="h-16 flex items-center justify-end px-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6 py-6 space-y-2 bg-white rounded-lg shadow-lg">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          
          
            <Link
              to="/clients"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 hover:scale-105"
            >
              <Building className="w-4 h-4" />
              Clients
            </Link>
            
            <Link
              to="/invitations"
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              Invitations
            </Link>

            <Link
            to="/users"
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-3 text-gray-700 font-medium rounded-lg transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 hover:scale-105"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Manage Users
          </Link>
          
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;