import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const token = localStorage.getItem("token");
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}api/admin/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chats data:", data);
      setChats(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewChatMessages = async (chatId) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `${API_URL}api/admin/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await response.json();
      setSelectedChat(data.chat);
      setMessages(data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      alert("Error loading messages");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4"
            style={{ borderTopColor: "#6B8E6E", borderBottomColor: "#6B8E6E" }}
          ></div>
          <p className="text-gray-600 text-lg font-medium">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Chats</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchChats}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Management</h1>
          <p className="text-gray-600">Monitor all user conversations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderLeftColor: "#6B8E6E" }}>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Chats</p>
            <p className="text-3xl font-bold text-gray-800">{chats.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Active Items</p>
            <p className="text-3xl font-bold text-blue-600">
              {chats.filter(c => c.itemId?.status === "pending" || c.itemId?.status === "matched").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-600">
              {chats.filter(c => c.itemId?.status === "resolved").length}
            </p>
          </div>
        </div>

        {/* Chat List */}
        {chats.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No chats yet</h3>
            <p className="text-gray-500">User conversations will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Chat List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">All Conversations</h2>
              {chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => viewChatMessages(chat._id)}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 p-4 ${
                    selectedChat?._id === chat._id 
                      ? "border-green-500" 
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {chat.itemId?.title || "Deleted Item"}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        chat.itemId?.type === "lost" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {chat.itemId?.type?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.itemId?.status === "resolved" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {chat.itemId?.status || "N/A"}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    {chat.participants?.map((user, idx) => (
                      <p key={user._id}>
                        <span className="font-semibold">User {idx + 1}:</span> {user.name} ({user.email})
                      </p>
                    ))}
                  </div>

                  {chat.lastMessage && (
                    <p className="text-sm text-gray-500 italic truncate mb-2">
                      "{chat.lastMessage}"
                    </p>
                  )}

                  <p className="text-xs text-gray-400">
                    {new Date(chat.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Messages */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 h-fit">
              {!selectedChat ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">👈</div>
                  <p className="text-gray-500">Select a chat to view messages</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {selectedChat.itemId?.title || "Chat Messages"}
                    </h2>
                    <div className="flex gap-2 text-sm text-gray-600">
                      {selectedChat.participants?.map((user, idx) => (
                        <span key={user._id} className="bg-gray-100 px-2 py-1 rounded">
                          {user.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">No messages yet</p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {messages.map(msg => (
                        <div key={msg._id} className="flex flex-col">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-sm" style={{ color: "#6B8E6E" }}>
                              {msg.sender?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 inline-block max-w-md">
                            <p className="text-gray-800">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}