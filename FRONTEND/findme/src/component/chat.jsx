import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const fetchChats = async () => {
    const res = await fetch("http://localhost:5000/api/chat", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setChats(data);
    
    if (chatId) {
      const current = data.find(c => c._id === chatId);
      setActiveChat(current);
    }
  };

  const fetchMessages = async () => {
    if (!chatId) return;
    
    const res = await fetch(
      `http://localhost:5000/api/chat/${chatId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;

    await fetch(`http://localhost:5000/api/chat/${chatId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    setText("");
    fetchMessages();
    fetchChats();
  };

  const selectChat = (chat) => {
    navigate(`/chat/${chat._id}`);
    setActiveChat(chat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <div className="flex h-screen">
        {/* Sidebar - Chat List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </button>
            </div>
           
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
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
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              chats.map((chat) => {
                const unread = chat.unreadCounts?.[user._id] || 0;
                const isActive = chatId === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                      isActive ? "bg-[#6B8E6E]/5 border-l-4 border-l-[#6B8E6E]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {chat.itemId?.title?.charAt(0).toUpperCase() || "C"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {chat.itemId?.title || "Untitled Chat"}
                          </h3>
                          {unread > 0 && (
                            <span className="flex-shrink-0 bg-gradient-to-r from-[#6B8E6E] to-[#557058] text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                              {unread > 99 ? "99+" : unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {chatId ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {activeChat?.itemId?.title?.charAt(0).toUpperCase() || "C"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {activeChat?.itemId?.title || "Conversation"}
                    </h2>
                    <p className="text-xs text-gray-500">Active now</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map((m) => {
                  const isMe = m.sender?._id === user._id;

                  return (
                    <div
                      key={m._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isMe 
                              ? "bg-gradient-to-br from-[#6B8E6E] to-[#557058]" 
                              : "bg-gray-400"
                          }`}>
                            <span className="text-white text-xs font-semibold">
                              {isMe ? "Y" : m.sender?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <p className="text-xs text-gray-500 mb-1 px-1">
                            {isMe ? "You" : m.sender?.name}
                          </p>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isMe
                                ? "bg-gradient-to-r from-[#6B8E6E] to-[#557058] text-white rounded-br-md"
                                : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{m.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6B8E6E] focus:border-transparent resize-none transition-all"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      rows="2"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-[#6B8E6E] to-[#557058] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={!text.trim()}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 px-1">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6B8E6E] to-[#557058] flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}