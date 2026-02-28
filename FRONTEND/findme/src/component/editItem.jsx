import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [type, setType] = useState("lost"); // lost or found
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // new image preview
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}api/item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load item");

        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setContactInfo(data.contactInfo);
        setType(data.type || "lost");
        setCurrentImage(data.image || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("contactInfo", contactInfo);
    formData.append("type", type);
    if (file) formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}api/item/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update item");

      alert("Item updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading item...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

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

      <form
        onSubmit={handleUpdate}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md mt-6"
      >
        <h2 className="text-2xl font-bold mb-3 text-center text-[#6B8E6E]">
          Edit Lost / Found Item
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Update the details below and save changes
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

        {/* ===== Lost / Found Toggle ===== */}
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

        {/* ===== Image Preview ===== */}
        {currentImage && !preview && (
          <img
            src={`${API_URL}/uploads/${currentImage}`}
            alt="current"
            className="w-32 h-32 object-cover mb-2 rounded"
          />
        )}
        {preview && (
          <img src={preview} alt="preview" className="w-32 h-32 object-cover mb-2 rounded" />
        )}
        <input type="file" onChange={handleFileChange} className="mb-4" />

        <button
          type="submit"
          className="w-full py-3 bg-[#6B8E6E] text-white rounded font-semibold hover:bg-[#5f7d5d] transition"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditItem;
