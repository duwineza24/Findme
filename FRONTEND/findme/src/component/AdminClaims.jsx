import { useEffect, useState } from "react";

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    const token = localStorage.getItem("token");
    
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/claims", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Claims data:", data);
      setClaims(data);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (itemId, claimId, status) => {
    const token = localStorage.getItem("token");

    if (!window.confirm(`Are you sure you want to ${status} this claim?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/claims/${itemId}/${claimId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update claim");
      }

      alert(`Claim ${status} successfully!`);
      fetchClaims(); // Refresh the list
    } catch (err) {
      console.error("Error updating claim:", err);
      alert("Error updating claim: " + err.message);
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
          <p className="text-gray-600 text-lg font-medium">Loading claims...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Claims</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchClaims}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter claims based on status
  const filteredClaims = filter === "all" 
    ? claims 
    : claims.filter(claim => claim.status === filter);

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === "pending").length,
    approved: claims.filter(c => c.status === "approved").length,
    rejected: claims.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Claims Management</h1>
          <p className="text-gray-600">Review and manage all item claims</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderLeftColor: "#6B8E6E" }}>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Claims</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition whitespace-nowrap ${
                filter === status
                  ? "text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={filter === status ? { backgroundColor: "#6B8E6E" } : {}}
            >
              {status} {status !== "all" && `(${stats[status]})`}
            </button>
          ))}
        </div>

        {/* Claims List */}
        {filteredClaims.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No {filter !== "all" ? filter : ""} claims found
            </h3>
            <p className="text-gray-500">
              {filter === "pending" 
                ? "All claims have been reviewed" 
                : "Claims will appear here once users submit them"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClaims.map(claim => (
              <div
                key={claim._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200" style={{ backgroundColor: "#f9faf9" }}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {claim.item?.title || "Unknown Item"}
                        </h3>
                        <span 
                          className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${
                            claim.item?.type === "lost" 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {claim.item?.type || "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        📍 {claim.item?.location || "No location"}
                      </p>
                    </div>
                    <span 
                      className={`text-sm px-4 py-2 rounded-full font-semibold uppercase self-start ${
                        claim.status === "pending" && "bg-yellow-100 text-yellow-700"
                      } ${
                        claim.status === "approved" && "bg-green-100 text-green-700"
                      } ${
                        claim.status === "rejected" && "bg-red-100 text-red-700"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Claim Message */}
                  <div className="mb-6 bg-gray-50 border-l-4 rounded-r-lg p-4" style={{ borderLeftColor: "#6B8E6E" }}>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Claim Message:</p>
                    <p className="text-gray-700 italic">
                      "{claim.message || "No message provided"}"
                    </p>
                  </div>

                  {/* User Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Item Owner</p>
                      <p className="font-semibold text-gray-800">{claim.owner?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">{claim.owner?.email || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                        Claimer ({claim.claimType === "found" ? "Found it" : "Lost it"})
                      </p>
                      <p className="font-semibold text-gray-800">{claim.claimer?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">{claim.claimer?.email || "N/A"}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      📅 {new Date(claim.createdAt).toLocaleString()}
                    </span>

                    {claim.status === "pending" && (
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleUpdateStatus(claim.item._id, claim._id, "approved")}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(claim.item._id, claim._id, "rejected")}
                          className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}

                    {claim.status !== "pending" && (
                      <span className="text-sm font-semibold" style={{ color: "#6B8E6E" }}>
                        {claim.status === "approved" ? "✓ This claim has been approved" : "✗ This claim has been rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}