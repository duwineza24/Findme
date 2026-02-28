import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-[#f0f4f2] to-[#e8f0e5]">
      {/* Left side with message */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center p-10">
        <div className="text-center max-w-md">
          <span className="text-5xl mb-4 block">🧭</span>
          <h1 className="text-4xl font-bold text-[#6B8E6E] mb-4">
            Reconnect What Matters
          </h1>
          <p className="text-gray-700">
            Join our community of helpers and finders. Report lost items, return
            found belongings, and help bring smiles back to people.
          </p>
        </div>
      </div>

      {/* Right side registration form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle floating decorative circles */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#6B8E6E]/20 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#6B8E6E]/20 rounded-full"></div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6E] focus:border-[#6B8E6E] transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6E] focus:border-[#6B8E6E] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6E] focus:border-[#6B8E6E] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full py-3 bg-[#6B8E6E] text-white font-semibold rounded-xl hover:bg-[#5f7d5d] transition shadow-md">
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#6B8E6E] hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="text-center text-xs mt-2 text-gray-400">
            <Link to="/" className="hover:underline">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
