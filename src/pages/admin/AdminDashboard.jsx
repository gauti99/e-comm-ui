import React from 'react';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '156', icon: FiShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Orders', value: '2,345', icon: FiPackage, color: 'bg-green-500' },
    { label: 'Total Users', value: '12.5k', icon: FiUsers, color: 'bg-purple-500' },
    { label: 'Revenue', value: '$45.2k', icon: FiDollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;