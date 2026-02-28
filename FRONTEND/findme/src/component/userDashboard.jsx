import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navBar";

export default function UserDashboard() {
  const [allItems, setAllItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [claimingItem, setClaimingItem] = useState(null); // Track which item is being claimed
  const [claimMessage, setClaimMessage] = useState(""); // Store claim message

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  // Open chat with claim user
  const openChat = async (itemId, otherUserId) => {
    const res = await fetch(`${API_URL}api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, otherUserId }),
    });
    const chat = await res.json();
    navigate(`/chat/${chat._id}`);
  };

  // Fetch all items and my items
  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        fetch(`${API_URL}api/item`),
        fetch(`${API_URL}api/item/my-items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAllItems(await allRes.json());
      setMyItems(await myRes.json());
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchData();
  }, []);

  // Claim an item
  const claimItem = async (id, claimType) => {
    if (!claimMessage.trim()) {
      alert("Please provide details about your claim");
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/item/${id}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ claimType, message: claimMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to submit claim");
        return;
      }

      alert("Claim submitted successfully!");
      setClaimingItem(null);
      setClaimMessage("");
      fetchData();
    } catch (err) {
      console.error("Error claiming item:", err);
      alert("Error submitting claim");
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`${API_URL}api/item/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  // Resolve an item
  const resolveItem = async (id) => {
    if (!window.confirm("Mark item as recovered?")) return;
    await fetch(`${API_URL}api/item/${id}/resolve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4"
            style={{ borderTopColor: "#6B8E6E", borderBottomColor: "#6B8E6E" }}
          ></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const itemsToShow = tab === "all" ? allItems : myItems;

  const stats = {
    total: allItems.length,
    lost: allItems.filter((i) => i.type === "lost").length,
    found: allItems.filter((i) => i.type === "found").length,
    my: myItems.length,
    resolved: myItems.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Section */}
        <div className="text-white rounded-2xl p-8 sm:p-10 mb-10" style={{ backgroundColor: "#6B8E6E" }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
              <p className="text-gray-100 text-lg">
                Help reunite lost items with their owners
              </p>
            </div>

            <button
              onClick={() => navigate("/add-item")}
              className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
            >
              + Report Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
          {[
            { label: "All Items", value: stats.total },
            { label: "Lost", value: stats.lost },
            { label: "Found", value: stats.found },
            { label: "My Items", value: stats.my },
            { label: "Recovered", value: stats.resolved },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
              <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {[
            { id: "all", label: "All Items" },
            { id: "my", label: "My Items" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                tab === id
                  ? "text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={tab === id ? { backgroundColor: "#6B8E6E" } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {itemsToShow.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No items yet</h3>
            <p className="text-gray-500">Start by reporting a lost or found item</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {itemsToShow.map((item) => {
              const isOwner = item.userId._id === user._id;
              const hasClaimed = item.claims?.some((c) => c.user._id === user._id);
              const isClaimingThisItem = claimingItem === item._id;

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {item.image ? (
                    <div className="relative h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.title}
                        className="h-full max-h-40 object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-gray-100 flex items-center justify-center">
                      <div className="text-6xl opacity-20 text-gray-400">
                        {item.type === "lost" ? "?" : "!"}
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl text-gray-800 flex-1 pr-2">{item.title}</h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          item.type === "lost"
                            ? "bg-gray-100 text-gray-700"
                            : "text-white"
                        }`}
                        style={item.type === "found" ? { backgroundColor: "#6B8E6E" } : {}}
                      >
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="text-xs text-gray-500 mb-4">📍 {item.location}</p>

                    {/* ✅ CLAIM SECTION */}
                    {!isOwner && tab === "all" && (
                      <div className="mt-4">
                        {!isClaimingThisItem ? (
                          <div className="flex flex-col gap-2">
                            {item.type === "lost" && (
                              <button
                                disabled={hasClaimed}
                                onClick={() => setClaimingItem(item._id)}
                                className="w-full py-2 rounded-xl font-bold bg-green-500 text-white hover:scale-105 transition disabled:opacity-50"
                              >
                                {hasClaimed ? "Already Claimed" : "I FOUND THIS"}
                              </button>
                            )}
                            {item.type === "found" && (
                              <button
                                disabled={hasClaimed}
                                onClick={() => setClaimingItem(item._id)}
                                className="w-full py-2 rounded-xl font-bold bg-red-500 text-white hover:scale-105 transition disabled:opacity-50"
                              >
                                {hasClaimed ? "Already Claimed" : "I LOST THIS"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                            <h4 className="font-semibold text-gray-800">Provide claim details:</h4>
                            <textarea
                              value={claimMessage}
                              onChange={(e) => setClaimMessage(e.target.value)}
                              placeholder="Describe unique features, where/when you lost/found it, etc."
                              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                              rows="3"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => claimItem(item._id, item.type === "lost" ? "found" : "lost")}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                              >
                                Submit Claim
                              </button>
                              <button
                                onClick={() => {
                                  setClaimingItem(null);
                                  setClaimMessage("");
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* My Items Tab */}
                    {tab === "my" && (
                      <>
                        <div className="mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            Status: {item.status}
                          </span>
                        </div>

                        {item.claims.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {item.claims.map((claim) => (
                              <div
                                key={claim._id}
                                className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{claim.user.name}</p>
                                    <p className="text-xs text-gray-600">
                                      <span>
                                        Said{" "}
                                        {claim.claimType === "found" ? (
                                          <span className="font-bold text-green-600">Found it</span>
                                        ) : (
                                          <span className="font-bold text-red-600">Lost it</span>
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    claim.status === "pending" && "bg-yellow-100 text-yellow-700"
                                  } ${
                                    claim.status === "approved" && "bg-green-100 text-green-700"
                                  } ${
                                    claim.status === "rejected" && "bg-red-100 text-red-700"
                                  }`}>
                                    {claim.status}
                                  </span>
                                </div>
                                
                                {claim.message && (
                                  <p className="text-sm text-gray-600 italic mb-3">"{claim.message}"</p>
                                )}
                                
                                <button
                                  onClick={() => openChat(item._id, claim.user._id)}
                                  className="w-full px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors duration-200"
                                  style={{ backgroundColor: "#6B8E6E" }}
                                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a7a5d")}
                                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#6B8E6E")}
                                >
                                  Chat
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/edit-item/${item._id}`)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="flex-1 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
                            style={{ backgroundColor: "#6B8E6E" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a7a5d")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6B8E6E")}
                          >
                            Delete
                          </button>
                          {item.status !== "resolved" && (
                            <button
                              onClick={() => resolveItem(item._id)}
                              className="flex-1 text-white py-3 rounded-xl font-semibold transition-colors duration-200"
                              style={{ backgroundColor: "#6B8E6E" }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a7a5d")}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6B8E6E")}
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}