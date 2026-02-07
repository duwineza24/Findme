
import { Link } from "react-router-dom";
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
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
    <Link to="/" className="text-sm text-gray-600 hover:text-[#6B8E6E] transition">
      Home
    </Link>
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

      {/* HERO SECTION */}
      <div
        className="text-white py-20 px-6 text-center"
        style={{ backgroundColor: "#6B8E6E" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Our Platform
        </h1>
        <p className="max-w-3xl mx-auto text-lg opacity-95">
          Helping people reconnect with their lost belongings through technology,
          trust, and community.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🎯 Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide a simple, secure, and reliable platform
              where people can report lost or found items and connect directly
              with others to recover them quickly and safely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🌍 Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where losing something no longer means losing
              hope — a connected community where honesty, responsibility, and
              technology work together to reunite people with what matters.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Report an Item",
                desc: "Users can report items they lost or found by providing details and an image.",
                icon: "📝",
              },
              {
                title: "Claim & Connect",
                desc: "Other users can claim items and start a secure chat with the owner or finder.",
                icon: "🤝",
              },
              {
                title: "Recover & Resolve",
                desc: "Once confirmed, the item is marked as recovered to complete the process.",
                icon: "✅",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow text-center hover:scale-105 transition"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="bg-white p-10 rounded-2xl shadow">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Trust", icon: "🔐" },
              { label: "Community", icon: "👥" },
              { label: "Transparency", icon: "🔍" },
              { label: "Compassion", icon: "❤️" },
            ].map((value, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-50">
                <div className="text-4xl mb-3">{value.icon}</div>
                <p className="font-semibold text-gray-700">{value.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IMPACT */}
        <div
          className="p-12 rounded-2xl text-white text-center"
          style={{ backgroundColor: "#6B8E6E" }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="max-w-3xl mx-auto text-lg opacity-95">
            By connecting people directly and responsibly, our platform reduces
            stress, saves time, and builds trust in communities. Every recovered
            item represents hope restored.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>
          © {new Date().getFullYear()} Lost & Found Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
