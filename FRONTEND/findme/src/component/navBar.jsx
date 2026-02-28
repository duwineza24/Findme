import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const chatRef = useRef();
  const notifRef = useRef();
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Fetch chats
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}api/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setChats);
  }, [token]);

  // 🔹 Fetch notifications
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}api/notification`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNotifications);
  }, [token]);

  // 🔹 Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) setShowChats(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Count unread chats
  const totalUnreadChats = chats.reduce((sum, chat) => {
    return sum + (chat.unreadCounts?.[user?._id] || 0);
  }, 0);

  // 🔹 Mark notification as read
  const handleNotificationClick = async (notif) => {
    navigate(notif.link);
    setShowNotifications(false);

    // Mark as read
    try {
      await fetch(`${API_URL}api/notification/${notif._id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm mb-10 relative">
      <div
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 cursor-pointer group"
      >
         <span className="text-3xl">🧭</span>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6B8E6E] to-[#557058] bg-clip-text text-transparent">
          FindMe
        </h1>
          {/* ✅ ADMIN BUTTON (ONLY FOR ADMIN) */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Admin Panel
          </button>
        )}
      </div>

      {token && user && (
        <div className="flex items-center gap-6 relative">
          {/* 🔔 Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 max-h-96 overflow-y-auto bg-white shadow-xl border border-gray-200 rounded-2xl z-50">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                </div>
                {notifications.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">No notifications</p>
                  </div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className="p-4 border-b border-gray-100 hover:bg-[#6B8E6E]/5 cursor-pointer transition-colors"
                  >
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 💬 Chats */}
          <div ref={chatRef} className="relative">
            <button
              onClick={() => setShowChats((prev) => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {totalUnreadChats > 0 && (
                <span className="absolute top-1 right-1 bg-gradient-to-r from-[#6B8E6E] to-[#557058] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {totalUnreadChats > 9 ? "9+" : totalUnreadChats}
                </span>
              )}
            </button>

            {showChats && (
              <div className="absolute right-0 mt-3 w-96 max-h-96 overflow-y-auto bg-white shadow-xl border border-gray-200 rounded-2xl z-50">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
                  <h3 className="font-bold text-gray-800">Messages</h3>
                </div>
                {chats.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">No chats yet</p>
                  </div>
                )}
                {chats.map((chat) => {
                  const unread = chat.unreadCounts?.[user._id] || 0;
                  return (
                    <div
                      key={chat._id}
                      onClick={() => {
                        navigate(`/chat/${chat._id}`);
                        setShowChats(false);
                      }}
                      className="p-4 border-b border-gray-100 hover:bg-[#6B8E6E]/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {chat.itemId?.title?.charAt(0).toUpperCase() || "C"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-gray-800 truncate">
                              {chat.itemId?.title || "Item"}
                            </p>
                            {unread > 0 && (
                              <span className="flex-shrink-0 bg-gradient-to-r from-[#6B8E6E] to-[#557058] text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-bold">
                                {unread > 9 ? "9+" : unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {chat.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>

          <button
            onClick={logout}
            className="px-5 py-2 text-sm font-medium bg-white border-2 border-[#6B8E6E] text-[#6B8E6E] rounded-lg hover:bg-[#6B8E6E] hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}