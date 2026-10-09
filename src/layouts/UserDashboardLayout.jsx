import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, Sparkles, Heart, Map, Star, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Explore Destinations', path: '/dashboard/explore', icon: <Compass size={18} /> },
    { label: 'Smart Recommendations', path: '/dashboard/recommendations', icon: <Sparkles size={18} /> },
    { label: 'My Favorites', path: '/dashboard/favorites', icon: <Heart size={18} /> },
    { label: 'My Trips & Itineraries', path: '/dashboard/itineraries', icon: <Map size={18} /> },
    { label: 'My Reviews', path: '/dashboard/reviews', icon: <Star size={18} /> },
    { label: 'Profile Settings', path: '/dashboard/profile', icon: <User size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header style={{ height: '65px', background: '#fff', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
              <Compass size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-main)' }}>
              Wanderlust
            </span>
          </Link>
          <span style={{ color: 'var(--border-light)', fontSize: '1.2rem' }}>|</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>User Portal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-outline btn-sm">
            <Home size={14} /> Back to Home
          </Link>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user?.name || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Travel Profile</div>
            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>Category: <strong>{user?.travelPreference || 'Beaches'}</strong></div>
            <div style={{ fontSize: '0.85rem' }}>Budget: <strong>{user?.budgetPreference || 'Medium'}</strong></div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--primary)' : 'var(--text-main)',
                    backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                    transition: 'var(--transition)'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
