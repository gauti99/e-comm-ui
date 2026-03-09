import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Products', value: '156', icon: FiShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Orders', value: '2,345', icon: FiPackage, color: 'bg-green-500' },
    { label: 'Total Users', value: '12.5k', icon: FiUsers, color: 'bg-purple-500' },
    { label: 'Revenue', value: '$45.2k', icon: FiDollarSign, color: 'bg-yellow-500' },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '$99.99', status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', amount: '$149.99', status: 'Processing' },
    { id: '#12347', customer: 'Bob Johnson', amount: '$79.99', status: 'Pending' },
    { id: '#12348', customer: 'Alice Brown', amount: '$299.99', status: 'Completed' },
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

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link to="/admin/orders" className="text-sm text-red-600 hover:text-red-700 font-medium">
            View All Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;