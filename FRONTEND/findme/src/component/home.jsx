import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';
  useEffect(() => {
    fetch(`${API_URL}api/item`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="bg-[#F7F7F5] text-gray-900 min-h-screen">

     <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
  {/* Logo Section */}
  <Link to="/" className="flex items-center gap-2">
    <span className="text-3xl">🧭</span> {/* Logo emoji */}
    <h1 className="text-xl font-extrabold">
      Find<span className="text-[#6B8E6E]">Me</span>
    </h1>
  </Link>

  {/* Navigation */}
  <nav className="flex items-center gap-6">
    <Link to="/about" className="text-sm text-gray-600 hover:text-[#6B8E6E] transition">
      About Us
    </Link>
    <Link to="/login" className="text-sm text-gray-600 hover:text-[#6B8E6E] transition">
      Login
    </Link>
    <Link
      to="/register"
      className="px-6 py-2 rounded-full border border-gray-400 text-sm font-semibold hover:bg-[#6B8E6E] hover:text-white transition"
    >
      Get Started
    </Link>
  </nav>
</header>


      {/* ===== HERO ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">
            Lost & Found Platform
          </p>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Lost things
            <br />
            still <span className="text-[#6B8E6E]">belong</span>
          </h2>

          <p className="text-gray-600 text-base max-w-lg mb-8">
            FindMe helps communities reconnect people with lost belongings —
            simply, respectfully, and safely.
          </p>

          <div className="flex gap-4">
            <Link
              to="/register"
              className="px-8 py-3 rounded-full bg-[#6B8E6E] text-white font-semibold"
            >
              Report Item
            </Link>

            <Link
              to="/login"
              className="px-8 py-3 rounded-full border border-gray-400 font-semibold"
            >
              Browse Items
            </Link>
          </div>
        </div>

        {/* Compact side card */}
        <div className="bg-white border border-gray-300 rounded-2xl p-8">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">
            Why FindMe
          </h3>

          <ul className="space-y-4 text-gray-700 text-sm">
            <li>• Built for trust & transparency</li>
            <li>• Community-driven reporting</li>
            <li>• Simple, honest design</li>
          </ul>
        </div>
      </section>

    
      {/* ===== ITEMS ===== */}
<section className="max-w-7xl mx-auto px-6 py-16">
  <div className="flex items-end justify-between mb-8">
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
        Community updates
      </p>
      <h3 className="text-2xl font-extrabold">
        Recently posted items
      </h3>
    </div>

    <span className="text-sm text-gray-500">
      {items.length} items
    </span>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item) => (
      <article
        key={item._id}
        className="group bg-white border border-gray-300 rounded-xl overflow-hidden
                   hover:border-[#6B8E6E] hover:shadow-md transition"
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-[#6B8E6E]/40" />

       

        <div className="p-6">
          {/* Type + location */}
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] uppercase tracking-wide font-semibold text-[#6B8E6E]">
              {item.type}
            </span>

            <span className="text-xs text-gray-400">
               {item.location}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-base leading-snug mb-2 group-hover:underline">
            {item.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-5">
            {item.description}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Posted by {item.userId?.name || "Anonymous"}
            </span>

            <span className="opacity-70">
              →
            </span>
          </div>
        </div>
      </article>
    ))}
  </div>
</section>


      {/* ===== FOOTER ===== */}
      <footer className="py-8 text-center text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} FindMe · Simple. Honest. Human.
      </footer>
    </div>
  );
};

export default Home;

