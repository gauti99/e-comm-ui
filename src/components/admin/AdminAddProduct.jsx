import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axiosconfig";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: "",
    price: "",
    category: "Electronics",
    countInStock: "",
    description: "",
    image: null, // ✅ changed
  });

  const [preview, setPreview] = useState(null); // ✅ new

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Toys",
  ];

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
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.brand ||
      !formData.price ||
      !formData.countInStock ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("size", formData.size);
      data.append("price", parseFloat(formData.price));
      data.append("category", formData.category);
      data.append("countInStock", parseInt(formData.countInStock));
      data.append("description", formData.description);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Product
        </h1>
        <p className="text-gray-500">
          Fill in the details below to add a new product
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow border space-y-4"
      >
        {/* NAME */}
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
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* BRAND */}
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
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* PRICE */}
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
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* SIZE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Size
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* STOCK */}
        <input
          type="number"
          name="countInStock"
          value={formData.countInStock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full px-3 py-2 border rounded-lg"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        />

        {/* ✅ IMAGE (same UI, just type=file) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Upload
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg"
          />

          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;