import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon, ChevronDown, LogOut, Lock } from "lucide-react";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";
// import { useAuth } from "../../contexts/AuthContext";

interface User {
  email: string;
  role: string;
}

interface ProfileDropdownProps {
  user: User | any;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {setIsAuthenticated} = useAuth();

  const handleLogout = async () => {
    try {
      const res:any = await userService.logout();
      if(res.success){
        sessionStorage.removeItem("access_token")
        setIsAuthenticated(false);
      navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-3 px-5 py-2 rounded-xl bg-gray-900/80 backdrop-blur-md hover:bg-gray-800 transition-all duration-300 shadow-lg border border-gray-700"
      >
        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
          <UserIcon size={22} className="text-white" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{user?.email || "User"}</p>
          <p className="text-gray-400 text-xs capitalize">
            {user?.role || "Guest"}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-white transition-transform duration-300 ${
            isProfileOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-3 w-52 bg-gray-900/90 backdrop-blur-md rounded-xl shadow-xl py-3 z-50 border border-gray-700">
          <button
            onClick={() => {
              setIsProfileOpen(false);
              handleLogout();
            }}
            className="flex items-center w-full px-5 py-2 text-sm text-white hover:bg-gray-800 transition-all duration-300 rounded-md"
          >
            <LogOut size={18} className="mr-3 text-white" />
            Logout
          </button>
          <Link
            onClick={() => setIsProfileOpen(false)}
            to="/update-password"
            className="flex items-center w-full px-5 py-2 text-sm text-white hover:bg-gray-800 transition-all duration-300 rounded-md"
          >
            <Lock size={18} className="mr-3 text-white" />
            Change Password
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
