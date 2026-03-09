import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiLogOut,
  FiX,
  FiPackage,
  FiBarChart2
} from 'react-icons/fi';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard', end: true },
    { path: '/admin/products', icon: FiShoppingBag, label: 'Products' },
    { path: '/admin/orders', icon: FiPackage, label: 'Orders' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-red-600">ADMIN</h1>
            <p className="text-xs text-gray-500">Management Panel</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg lg:hidden hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end || false}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => {
                    console.log(`Item: ${item.label}, isActive: ${isActive}`); // Debug log
                    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-red-50 text-red-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`;
                  }}
                >
                  <item.icon className={`w-5 h-5 ${
                    location.pathname === item.path ? 'text-red-600' : 'text-gray-500'
                  }`} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            
            <li className="pt-4 mt-4 border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;