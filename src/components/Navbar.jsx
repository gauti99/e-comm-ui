import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

function Navbar() {

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
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
            onClick={logoutHandler}
            className="hover:text-red-500 transition"
          >
            <FiLogOut />
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;