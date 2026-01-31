import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/chat", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setChats);
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Chats</h2>

      {chats.map((chat) => {
        const unread = chat.unreadCounts?.[user._id] || 0;

        return (
          <div
            key={chat._id}
            onClick={() => navigate(`/chat/${chat._id}`)}
            className="p-4 border-b cursor-pointer flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {chat.itemId?.title || "Item"}
              </p>
              <p className="text-sm text-gray-500">
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>

            {unread > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {unread}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
