import React from 'react';
import { FiMenu, FiBell, FiSearch, FiUser } from 'react-icons/fi';

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg lg:hidden hover:bg-gray-100"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
            <FiSearch className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="ml-2 bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-gray-500">admin@redline.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;