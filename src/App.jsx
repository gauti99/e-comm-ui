import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./components/admin/AdminProducts";
import AdminAddProduct from "./components/admin/AdminAddProduct";
// import AdminEditProduct from "./admin/pages/AdminEditProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";

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
          <Route  path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          {/* <Route path="products/edit/:id" element={<AdminEditProduct />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;