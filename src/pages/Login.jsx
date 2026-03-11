import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // Stop API call if errors exist
    if (Object.keys(newErrors).length > 0) return;

    try {
      const { data } = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="bg-zinc-900 p-10 rounded-xl w-full max-w-md border border-zinc-800 shadow-2xl">

        {/* Logo */}
        <h1 className="text-4xl font-extrabold text-center tracking-widest mb-2">
          <span className="text-red-600">RED</span>
          <span className="text-white">LINE</span>
        </h1>

        <p className="text-center text-gray-400 text-sm mb-8">
          Welcome back to the racing culture
        </p>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border transition 
              ${errors.email ? "border-red-500" : "border-transparent focus:border-red-600"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password with Show/Hide Toggle */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full p-3 pr-12 rounded-lg bg-zinc-800 text-white outline-none border transition 
                ${errors.password ? "border-red-500" : "border-transparent focus:border-red-600"}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              {/* Eye icon for show/hide password */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
  
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Button */}
          <button className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold transition">
            LOGIN
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-500 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;