import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post("/users/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="bg-zinc-900 p-10 rounded-xl w-full max-w-md border border-zinc-800 shadow-2xl">

        {/* Brand */}
        <h1 className="text-4xl font-extrabold text-center tracking-widest mb-2">
          <span className="text-red-600">RED</span>
          <span className="text-white">LINE</span>
        </h1>

        <p className="text-center text-gray-400 text-sm mb-8">
          Join the racing culture
        </p>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Button */}
          <button className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold transition">
            CREATE ACCOUNT
          </button>

        </form>

        {/* Login link */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;