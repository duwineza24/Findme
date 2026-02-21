import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AddItem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [type, setType] = useState("lost"); // lost or found
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("contactInfo", contactInfo);
    formData.append("type", type);
    if (file) formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/api/item`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add item");
        setLoading(false);
        return;
      }

      alert("Item added successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF4] flex flex-col items-center">
      {/* ===== Header ===== */}
      <header className="w-full max-w-4xl px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-[#6B8E6E] flex items-center gap-2">
          🧭 FindMe
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-[#6B8E6E] text-white rounded-lg font-semibold hover:bg-[#5f7d5d] transition"
        >
          Back to Dashboard
        </Link>
      </header>

      {/* ===== Form ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-3 text-center text-[#6B8E6E]">
          Add Lost / Found Item
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Fill in the details below to post a lost or found item
        </p>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#6B8E6E]"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#6B8E6E]"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#6B8E6E]"
          required
        />

        <input
          type="text"
          placeholder="Contact Info"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-[#6B8E6E]"
        />

        {/* ===== Lost / Found Selector ===== */}
        <div className="flex gap-4 mb-4 justify-center">
          {["lost", "found"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setType(option)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                type === option
                  ? "bg-[#6B8E6E] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ===== Image Upload Preview ===== */}
        <input type="file" onChange={handleFileChange} className="mb-4" />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 bg-[#6B8E6E] text-white rounded font-semibold hover:bg-[#5f7d5d] transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
