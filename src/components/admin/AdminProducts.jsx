import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import axios from "../../config/axiosconfig"; // Import the configured axios instance
// Import the configured axios

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = [
    "all",
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
  ];

  useEffect(() => {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Token will be automatically added by interceptor
      const res = await axios.get("/products");
      
      console.log("API Response:", res.data);
      const productsData = res.data.data || res.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        alert("Failed to fetch products. Please try again.");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      // Token will be automatically added by interceptor
      await axios.delete(`/products/${productToDelete._id}`);
      
      setProducts((prev) =>
        prev.filter((p) => p._id !== productToDelete._id)
      );
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Show success message (you can add a toast notification here)
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "Failed to delete product. Please try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>

        <Link
          to="/admin/products/add"
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FiPlus />
          <span>Add Product</span>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="w-48 relative">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No products found. 
                      <Link to="/admin/products/add" className="text-red-600 hover:text-red-700 ml-1 font-medium">
                        Add your first product
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40';
                            }}
                          />
                    <div >
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              ID: {product._id?.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                        <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {product.brand}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.countInStock} units
                      </td> <td className="px-6 py-4 text-sm text-gray-500">
                        {product.size ||"--"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.countInStock > 20
                              ? "bg-green-100 text-green-800"
                              : product.countInStock > 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.countInStock > 20
                            ? "In Stock"
                            : product.countInStock > 10
                            ? "Low Stock"
                            : "Critical"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Edit product"
                          >
                            <FiEdit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete product"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Confirm Delete</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete <span className="font-semibold">"{productToDelete?.name}"</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;