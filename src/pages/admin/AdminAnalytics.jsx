import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, 
  FiUsers, FiPackage, FiCalendar
} from "react-icons/fi";
import axios from "../../config/axiosconfig";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const [analyticsData, setAnalyticsData] = useState({
    salesData: [],
    categoryData: [],
    topProducts: [],
    userGrowth: [],
    orderStatusData: [],
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      usersGrowth: 0,
      avgOrderValue: 0
    }
  });

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    fetchAnalyticsData();
  }, [navigate, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("/users"),
        axios.get("/products"),
        axios.get("/orders")
      ]);

      const users = usersRes.data.data || usersRes.data;
      const products = productsRes.data.data || productsRes.data;
      const orders = ordersRes.data.data || ordersRes.data;

      // Process data based on time range
      const processedData = processAnalyticsData(users, products, orders, timeRange);
      setAnalyticsData(processedData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        alert("Failed to fetch analytics data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (users, products, orders, range) => {
    // Calculate date ranges
    const now = new Date();
    let startDate = new Date();
    
    switch(range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Filter orders by date range
    const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
      new Date(order.createdAt) >= startDate
    ) : [];

    // Sales data for chart
    const salesData = generateSalesData(filteredOrders, range);
    
    // Category distribution
    const categoryData = generateCategoryData(products);
    
    // Top products by sales
    const topProducts = generateTopProducts(orders);
    
    // User growth data
    const userGrowth = generateUserGrowthData(users, range);
    
    // Order status distribution
    const orderStatusData = generateOrderStatusData(orders);

    // Calculate summary statistics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = filteredOrders.length;
    const totalUsers = Array.isArray(users) ? users.length : 0;
    const totalProducts = Array.isArray(products) ? products.length : 0;
    
    // Calculate growth percentages (compare with previous period)
    const previousPeriodRevenue = calculatePreviousPeriodRevenue(orders, range);
    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      salesData,
      categoryData,
      topProducts,
      userGrowth,
      orderStatusData,
      summary: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        revenueGrowth,
        ordersGrowth: 15, // Example static value - calculate similarly
        usersGrowth: 8, // Example static value - calculate similarly
        avgOrderValue
      }
    };
  };

  const generateSalesData = (orders, range) => {
    const salesMap = new Map();
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key;
      
      if (range === 'week') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (range === 'month') {
        key = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      salesMap.set(key, (salesMap.get(key) || 0) + (order.totalAmount || 0));
    });

    return Array.from(salesMap, ([date, revenue]) => ({ date, revenue }));
  };

  const generateCategoryData = (products) => {
    const categoryMap = new Map();
    
    (Array.isArray(products) ? products : []).forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap, ([name, value]) => ({ name, value }));
  };

  const generateTopProducts = (orders) => {
    const productSales = new Map();
    
    (Array.isArray(orders) ? orders : []).forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productName = item.product?.name || item.name || 'Unknown';
          productSales.set(productName, 
            (productSales.get(productName) || 0) + (item.quantity || 1)
          );
        });
      }
    });

    return Array.from(productSales, ([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  };

  const generateUserGrowthData = (users, range) => {
    const growthMap = new Map();
    
    (Array.isArray(users) ? users : []).forEach(user => {
      const date = new Date(user.createdAt);
      let key;
      
      if (range === 'week') {
        key = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (range === 'month') {
        key = `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      growthMap.set(key, (growthMap.get(key) || 0) + 1);
    });

    return Array.from(growthMap, ([date, users]) => ({ date, users }));
  };

  const generateOrderStatusData = (orders) => {
    const statusMap = new Map();
    
    (Array.isArray(orders) ? orders : []).forEach(order => {
      const status = order.status || 'pending';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    return Array.from(statusMap, ([name, value]) => ({ name, value }));
  };

  const calculatePreviousPeriodRevenue = (orders, range) => {
    // Simplified calculation - you can make this more sophisticated
    return 15000; // Example static value
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const SummaryCard = ({ title, value, icon: Icon, growth, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
        {growth !== undefined && (
          <div className={`flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {growth >= 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
            <span className="text-sm font-medium ml-1">{Math.abs(growth)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Track your business performance</p>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">Last 12 Months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.summary.totalRevenue)}
          icon={FiDollarSign}
          color="bg-green-500"
          growth={analyticsData.summary.revenueGrowth}
        />
        
        <SummaryCard
          title="Total Orders"
          value={formatNumber(analyticsData.summary.totalOrders)}
          icon={FiShoppingBag}
          color="bg-blue-500"
          growth={analyticsData.summary.ordersGrowth}
        />
        
        <SummaryCard
          title="Total Users"
          value={formatNumber(analyticsData.summary.totalUsers)}
          icon={FiUsers}
          color="bg-purple-500"
          growth={analyticsData.summary.usersGrowth}
        />
        
        <SummaryCard
          title="Avg. Order Value"
          value={formatCurrency(analyticsData.summary.avgOrderValue)}
          icon={FiPackage}
          color="bg-red-500"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#4ECDC4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#45B7D1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#96CEB4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;