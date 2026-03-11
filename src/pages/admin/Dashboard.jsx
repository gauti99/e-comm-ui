import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiArrowUp, FiArrowDown } from "react-icons/fi";
import axios from "../../config/axiosconfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("/users"),
        axios.get("/products"),
        axios.get("/orders")
      ]);

      // Process users data
      const usersData = usersRes.data.data || usersRes.data;
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;

      // Process products data
      const productsData = productsRes.data.data || productsRes.data;
      const totalProducts = Array.isArray(productsData) ? productsData.length : 0;

      // Process orders data
      const ordersData = ordersRes.data.data || ordersRes.data;
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      
      // Calculate total revenue
      const totalRevenue = Array.isArray(ordersData)
        ? ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        : 0;

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        alert("Failed to fetch dashboard data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <FiArrowUp className="text-green-500 mr-1" size={16} />
              ) : (
                <FiArrowDown className="text-red-500 mr-1" size={16} />
              )}
              <span className={`text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change} from last month
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="bg-blue-500"
          change="+12%"
          changeType="increase"
        />
        
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="bg-green-500"
          change="+5%"
          changeType="increase"
        />
        
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FiShoppingBag}
          color="bg-purple-500"
          change="+8%"
          changeType="increase"
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={FiDollarSign}
          color="bg-red-500"
          change="+15%"
          changeType="increase"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;