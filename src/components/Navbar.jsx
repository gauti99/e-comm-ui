import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";

function Navbar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    console.log("Logging out..."); // Debug log
    localStorage.removeItem("userInfo");
    navigate("/login");
    setShowLogoutModal(false);
  };

  const openModal = () => {
    console.log("Opening modal"); // Debug log
    setShowLogoutModal(true);
  };

  const closeModal = () => {
    console.log("Closing modal"); // Debug log
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/">
            <h1 className="text-2xl font-extrabold tracking-widest font-[Orbitron]">
              <span className="text-red-600">RED</span>
              <span className="text-white">LINE</span>
            </h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-6 text-2xl text-gray-300">

            {/* Profile */}
            <Link to="/profile" className="hover:text-red-500 transition">
              <FaUserCircle />
            </Link>

            {/* Logout */}
            <button
              onClick={openModal}
              className="hover:text-red-500 transition cursor-pointer"
              type="button"
            >
              <FiLogOut />
            </button>

          </div>

        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // Click outside to close
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded transition cursor-pointer"
                type="button"
              >
                No
              </button>
              <button
                onClick={logoutHandler}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition cursor-pointer"
                type="button"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;