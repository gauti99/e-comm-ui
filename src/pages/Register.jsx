import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

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

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-transparent focus:border-red-600 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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