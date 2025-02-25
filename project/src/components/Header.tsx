import React from 'react';
import { Menu, X, PlusCircle, Heart, Map, BarChart3, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { login, logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

import { persistor } from '../store'; // Import persistor
import axiosInstance from '../config/axios.config';


export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    navigate('/login')
    dispatch(login({ name: 'User' }));
  };

  const handleLogout = async () => {
    // const response = await axiosInstance.post('/users/logout');
    dispatch(logout()); // Reset Redux state
    persistor.purge(); // ✅ Clears persisted Redux store
    persistor.flush(); // ✅ Ensures changes are applied immediately
    localStorage.removeItem("token"); // ✅ Remove token from storage
    navigate("/login"); // Redirect after logout
  };

  const menuItems = [
    { name: 'Donate Medicine', icon: PlusCircle, href: '#donate' },
    { name: 'Find NGOs', icon: Map, href: '#ngos' },
    { name: 'Health Insights', icon: Heart, href: '#insights' },
    { name: 'Dashboard', icon: BarChart3, href: '#dashboard' },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-emerald-600">MediShare</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}

            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Log In</span>
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}