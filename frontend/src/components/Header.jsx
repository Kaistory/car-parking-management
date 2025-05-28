import { Home, Users, Car, BarChart3, Calendar, Mail, Archive, Clock, Layers, FileText, Grid, TrendingUp, TrendingDown, Facebook, Twitter, Linkedin, Bell, Search, MessageSquare } from 'lucide-react';
import {Link} from "react-router-dom"
import { User, LogOut, CircleUser } from 'lucide-react';
import { Button } from "react-bootstrap";
import { useContext,  useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { DashBoardContext } from '../context/DashboardContext';
const Header = () =>{
    const {user, logoutUser} = useContext(AuthContext);
    const {activeItem} = useContext(DashBoardContext);
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfile = () => {
    alert('Chuyển đến trang Hồ sơ');
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
  };
    return(
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">{activeItem}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
              {formatDate(currentTime)} - {formatTime(currentTime)}
              </div>
              <Button className="p-2 text-gray-500 hover:text-gray-700">
                <Search className="w-5 h-5" />
              </Button>
              <Button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
              </Button>
              <Button  className="p-2 text-gray-500 hover:text-gray-700">
                <MessageSquare className="w-5 h-5" />
              </Button>
              
              <Button onClick={toggleDropdown} className="w-8 h-8 text-gray-500 hover:text-gray-700">
                <CircleUser className="w-5 h-5" />
                {isOpen && (
            <div 
            style={{ marginLeft: "-50px" , marginTop: "30px" }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 animate-in fade-in duration-150">
            {/* Profile Option */}
            <button
              onClick={handleProfile}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              <User className="w-4 h-4 mr-3 text-gray-500" />
              <span className="text-sm font-medium">Hồ sơ</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-500" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        )}
              </Button>
            </div>
            
          </div>
        </header>
    )
}

export default Header