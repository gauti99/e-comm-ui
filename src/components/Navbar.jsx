import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-extrabold tracking-widest">
          <span className="text-red-600">RED</span>LINE
        </h1>

        <div className="space-x-8 text-sm font-semibold uppercase tracking-wider">

          <Link to="/" className="hover:text-red-500 transition">
            Shop
          </Link>

          <Link to="/login" className="hover:text-red-500 transition">
            Login
          </Link>

          <Link to="/register" className="hover:text-red-500 transition">
            Register
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;