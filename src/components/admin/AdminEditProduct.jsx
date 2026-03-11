import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axiosconfig";

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: "",
    price: "",
    category: "Electronics",
    countInStock: "",
    description: "",
    image: "",
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
  ];

  // Size options based on category
  const sizeOptions = {
    Clothing: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    Shoes: ["6", "7", "8", "9", "10", "11", "12"],
    Electronics: ["N/A"],
    Books: ["N/A"],
    "Home & Garden": ["N/A"],
    Sports: ["N/A"],
    Toys: ["N/A"],
  };

  useEffect(() => {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Fetch product details
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        const product = response.data;
        
        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          size: product.size || "",
          price: product.price || "",
          category: product.category || "Electronics",
          countInStock: product.countInStock || "",
          description: product.description || "",
          image: product.image || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        } else if (error.response?.status === 404) {
          alert("Product not found");
          navigate("/admin/products");
        } else {
          alert("Failed to fetch product details");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!formData.name || !formData.brand || !formData.price || !formData.countInStock || !formData.description) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Convert price and stock to numbers
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      countInStock: parseInt(formData.countInStock)
    };

    try {
      // Token will be automatically added by interceptor
      await axios.put(`/products/${id}`, productData);
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('userInfo');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "Failed to update product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };



  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500">Update the product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        {/* Brand Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter brand name (e.g., Nike, Apple, Samsung)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Size Field - Conditional rendering based on category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size <span className="text-red-500">*</span>
          </label>
          {(formData.category === "Clothing" || formData.category === "Sports") ? (
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select size</option>
              {sizeOptions.Clothing.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          ) : formData.category === "Shoes" ? (
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select size</option>
              {sizeOptions.Shoes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter size (e.g., Medium, 15-inch, One Size)"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
         
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;