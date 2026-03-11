import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiUser, FiCamera } from "react-icons/fi";
import axios from "../../config/axiosconfig";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePhoto: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user || !user.token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          profilePhoto: user.profilePhoto || null
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setErrorMessage("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePhoto: reader.result }));
        // Clear any previous error messages
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.put("/users/profile", profileData);
      setSuccessMessage("Profile updated successfully!");
      
      // Update local storage
      const user = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({
        ...user,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        profilePhoto: profileData.profilePhoto
      }));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const SettingCard = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your profile settings</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit}>
        <SettingCard title="Profile Information">
          <div className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                  {profileData.profilePhoto ? (
                    <img 
                      src={profileData.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FiUser size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                >
                  <FiCamera size={16} />
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
                <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        </SettingCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave size={18} />
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;