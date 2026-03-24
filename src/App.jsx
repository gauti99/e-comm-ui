import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './components/admin/AdminProducts';
import AdminAddProduct from './components/admin/AdminAddProduct';
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSetting from "./pages/admin/AdminSetting";
import Dashboard from "./pages/admin/Dashboard";
import AdminEditProduct from "./components/admin/AdminEditProduct";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSetting />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;