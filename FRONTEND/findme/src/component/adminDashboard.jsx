import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaChartBar, 
  FaBoxOpen, 
  FaUsers, 
  FaClipboardList, 
  FaComments,
  FaSignOutAlt,
  FaSearch,
  FaCheckCircle,
  FaTrash,
  FaCrown,
  FaUser
} from "react-icons/fa";
import AdminClaims from "./AdminClaims";
import AdminChats from "./AdminChats";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("overview");
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  useEffect(() => {
    fetch(`${API_URL}api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);

    fetch(`${API_URL}api/admin/items`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setItems)
      .catch(console.error);

    fetch(`${API_URL}api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API_URL}api/admin/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(items.filter(i => i._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 z-40 p-6 flex flex-col">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-xl flex items-center justify-center">
              <FaSearch className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FindMe</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {[
            { id: "overview", icon: FaChartBar, label: "Overview" },
            { id: "items", icon: FaBoxOpen, label: "Items" },
            { id: "users", icon: FaUsers, label: "Users" },
            { id: "claims", icon: FaClipboardList, label: "Claims" },
            { id: "chats", icon: FaComments, label: "Chats" },
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeView === view.id
                    ? "bg-gradient-to-r from-emerald-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="text-lg" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 transition-all"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="ml-72 p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          </h2>
          <p className="text-slate-400">
            {activeView === "overview" && "System overview and statistics"}
            {activeView === "items" && "Manage all lost and found items"}
            {activeView === "users" && "User management and information"}
            {activeView === "claims" && "Review and manage item claims"}
            {activeView === "chats" && "Monitor user conversations"}
          </p>
        </div>

        {/* Overview Stats */}
        {activeView === "overview" && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { label: "Total Users", value: stats.users, icon: FaUsers, gradient: "from-blue-500 to-cyan-500" },
              { label: "All Items", value: stats.items, icon: FaBoxOpen, gradient: "from-purple-500 to-pink-500" },
              { label: "Lost Items", value: stats.lost, icon: FaSearch, gradient: "from-orange-500 to-red-500" },
              { label: "Found Items", value: stats.found, icon: FaCheckCircle, gradient: "from-emerald-500 to-green-500" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="text-2xl text-white" />
                    </div>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value || 0}
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Items View */}
        {activeView === "items" && (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-32 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <FaBoxOpen className="text-8xl mb-6 opacity-20 text-slate-400 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No items found</h3>
                <p className="text-slate-500">Items will appear here once users report them</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        item.type === "lost" 
                          ? "bg-gradient-to-br from-orange-500 to-red-500" 
                          : "bg-gradient-to-br from-emerald-500 to-green-500"
                      } shadow-lg`}>
                        {item.type === "lost" ? (
                          <FaSearch className="text-3xl text-white" />
                        ) : (
                          <FaCheckCircle className="text-3xl text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-slate-400 text-sm mb-1">
                          Posted by <span className="text-purple-400 font-semibold">{item.userId?.name || "Unknown"}</span>
                        </p>
                        <div className="flex gap-2 items-center">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            item.status === "resolved" 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                              : item.status === "matched"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}>
                            {item.status}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            item.type === "lost"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users View */}
        {activeView === "users" && (
          <div>
            {users.length === 0 ? (
              <div className="text-center py-32 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
                <FaUsers className="text-8xl mb-6 opacity-20 text-slate-400 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No users found</h3>
                <p className="text-slate-500">Registered users will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all hover:scale-105"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-purple-500/50">
                      <FaUser className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{u.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{u.email}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-4 py-1.5 rounded-full font-semibold ${
                      u.role === "admin" 
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50" 
                        : "bg-slate-700/50 text-slate-300 border border-slate-600"
                    }`}>
                      {u.role === "admin" && <FaCrown />}
                      {u.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claims View */}
        {activeView === "claims" && (
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <AdminClaims />
          </div>
        )}

        {/* Chats View */}
        {activeView === "chats" && (
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <AdminChats />
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}