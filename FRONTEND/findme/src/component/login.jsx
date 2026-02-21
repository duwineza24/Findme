import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#F5F1EB] to-[#E0DCD2]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* ================= Creative Illustration Sidebar ================= */}
        <div className="hidden md:flex md:w-1/2 bg-[#D9CDBB] p-12 flex-col justify-between relative overflow-hidden">
          {/* Soft gradient circles */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#C5B89A] rounded-full opacity-40 animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#BFA986] rounded-full opacity-40 animate-pulse" />

          <div className="z-10 relative">
            <h2 className="text-4xl font-bold text-[#6B8E6E] mb-4">Welcome Back!</h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Log in to FindMe, your trusted platform for reporting lost items,
              returning found belongings, and helping your community reconnect.
            </p>

            {/* Placeholder for illustration */}
            <div className="w-full h-64 bg-[#C5B89A] rounded-xl flex items-center justify-center text-6xl text-white font-bold">
              🧭
            </div>
          </div>

          <Link
            to="/"
            className="mt-6 text-sm font-semibold text-[#6B8E6E] hover:underline relative z-10"
          >
            ← Back to Home
          </Link>
        </div>

        {/* ================= Login Form ================= */}
        <div className="w-full md:w-1/2 p-10 relative">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#D9CDBB] rounded-full opacity-40 animate-pulse" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#C5B89A] rounded-full opacity-40 animate-pulse" />

          <h2 className="text-3xl font-bold text-center text-[#6B8E6E] mb-8 relative z-10">
            Log in to your account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4 relative z-10">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6E] transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6B8E6E] transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full py-3 bg-[#6B8E6E] text-white rounded-xl font-semibold shadow-md hover:bg-[#55775C] transition transform hover:-translate-y-1">
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-600 relative z-10">
            No account?{" "}
            <Link to="/register" className="font-medium text-[#6B8E6E] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
