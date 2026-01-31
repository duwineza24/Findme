import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setStats);

    fetch("http://localhost:5000/api/admin/items", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setItems);

    fetch("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await fetch(`http://localhost:5000/api/admin/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(items.filter(i => i._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1f1a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,142,110,0.06) 0%, transparent 70%)',
        top: '-150px',
        right: '-150px',
        filter: 'blur(80px)'
      }}></div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(107, 142, 110, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(107, 142, 110, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#e8f0e8',
                marginBottom: '0.5rem'
              }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#a8c5a8', fontSize: '1rem' }}>
                Lost & Found Management
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {['overview', 'items', 'users'].map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: activeView === view 
                      ? '#6B8E6E'
                      : 'rgba(107, 142, 110, 0.1)',
                    border: `1px solid ${activeView === view ? '#6B8E6E' : 'rgba(107, 142, 110, 0.3)'}`,
                    borderRadius: '10px',
                    color: activeView === view ? '#ffffff' : '#a8c5a8',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={e => {
                    if (activeView !== view) {
                      e.currentTarget.style.background = 'rgba(107, 142, 110, 0.2)';
                      e.currentTarget.style.color = '#c8e5c8';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeView !== view) {
                      e.currentTarget.style.background = 'rgba(107, 142, 110, 0.1)';
                      e.currentTarget.style.color = '#a8c5a8';
                    }
                  }}
                >
                  {view}
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(107, 142, 110, 0.15)',
                  border: '1px solid rgba(107, 142, 110, 0.4)',
                  borderRadius: '10px',
                  color: '#8aac8a',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.875rem'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(107, 142, 110, 0.25)';
                  e.currentTarget.style.borderColor = '#6B8E6E';
                  e.currentTarget.style.color = '#e8f0e8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(107, 142, 110, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.4)';
                  e.currentTarget.style.color = '#8aac8a';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Users', value: stats.users, icon: '👥' },
            { label: 'Items', value: stats.items, icon: '📦' },
            { label: 'Lost', value: stats.lost, icon: '🔍' },
            { label: 'Found', value: stats.found, icon: '✅' },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(107, 142, 110, 0.08)',
                border: '1px solid rgba(107, 142, 110, 0.2)',
                borderRadius: '16px',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(107, 142, 110, 0.12)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(107, 142, 110, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.2)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '2.5rem',
                opacity: 0.2,
                filter: 'grayscale(0.3)'
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{
                  color: '#8aac8a',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  {stat.label}
                </p>
                <h2 style={{
                  color: '#e8f0e8',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  margin: 0
                }}>
                  {stat.value || 0}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Items View */}
        {activeView === 'items' && (
          <div style={{
            background: 'rgba(107, 142, 110, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(107, 142, 110, 0.2)',
            borderRadius: '20px',
            padding: '2rem'
          }}>
            <h2 style={{
              color: '#e8f0e8',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem'
            }}>
              Reported Items
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  style={{
                    background: 'rgba(107, 142, 110, 0.06)',
                    border: '1px solid rgba(107, 142, 110, 0.15)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    animation: `slideIn 0.4s ease-out ${idx * 0.05}s both`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(107, 142, 110, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(107, 142, 110, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.15)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: item.type === 'lost' 
                        ? 'rgba(107, 142, 110, 0.15)'
                        : 'rgba(107, 142, 110, 0.25)',
                      border: `1px solid rgba(107, 142, 110, 0.3)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {item.type === 'lost' ? '🔍' : '✅'}
                    </div>
                    <div>
                      <h3 style={{
                        color: '#e8f0e8',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        margin: '0 0 0.375rem 0'
                      }}>
                        {item.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          background: 'rgba(107, 142, 110, 0.2)',
                          color: '#a8c5a8',
                          border: `1px solid rgba(107, 142, 110, 0.3)`
                        }}>
                          {item.type}
                        </span>
                        <span style={{
                          color: '#7a9d7a',
                          fontSize: '0.875rem'
                        }}>
                          by {item.userId?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteItem(item._id)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: 'rgba(107, 142, 110, 0.15)',
                      border: '1px solid rgba(107, 142, 110, 0.3)',
                      borderRadius: '8px',
                      color: '#8aac8a',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#6B8E6E';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#6B8E6E';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(107, 142, 110, 0.15)';
                      e.currentTarget.style.color = '#8aac8a';
                      e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.3)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <div style={{
            background: 'rgba(107, 142, 110, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(107, 142, 110, 0.2)',
            borderRadius: '20px',
            padding: '2rem'
          }}>
            <h2 style={{
              color: '#e8f0e8',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem'
            }}>
              Registered Users
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {users.map((u, idx) => (
                <div
                  key={u._id}
                  style={{
                    background: 'rgba(107, 142, 110, 0.06)',
                    border: '1px solid rgba(107, 142, 110, 0.15)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    transition: 'all 0.3s',
                    animation: `slideIn 0.4s ease-out ${idx * 0.05}s both`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(107, 142, 110, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(107, 142, 110, 0.06)';
                    e.currentTarget.style.borderColor = 'rgba(107, 142, 110, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      margin: '0 auto 1.25rem',
                      borderRadius: '50%',
                      background: '#6B8E6E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      border: '2px solid rgba(107, 142, 110, 0.4)'
                    }}>
                      {u.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <h3 style={{
                      color: '#e8f0e8',
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      margin: '0 0 0.375rem 0'
                    }}>
                      {u.name}
                    </h3>
                    <p style={{
                      color: '#8aac8a',
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      {u.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}