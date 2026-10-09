import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Camera, Layers, Star, BarChart3, Shield, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Manage Users', path: '/admin/users', icon: <Users size={18} /> },
    { label: 'Manage Destinations', path: '/admin/destinations', icon: <MapPin size={18} /> },
    { label: 'Manage Attractions', path: '/admin/attractions', icon: <Camera size={18} /> },
    { label: 'Manage Categories', path: '/admin/categories', icon: <Layers size={18} /> },
    { label: 'Review Moderation', path: '/admin/reviews', icon: <Star size={18} /> },
    { label: 'System Reports', path: '/admin/reports', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Header */}
      <header style={{ height: '65px', background: 'var(--bg-dark)', color: '#fff', borderBottom: '1px solid var(--border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 90 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
            <Shield size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Wanderlust Admin Control Center
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: '#475569' }}>
            <Home size={14} /> Public Home
          </Link>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{user?.name || 'Administrator'}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super Admin</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Dark Admin Sidebar */}
        <aside className="sidebar" style={{ backgroundColor: 'var(--bg-dark-surface)', borderColor: 'var(--border-dark)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.05em' }}>
            System Management
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
                    color: active ? '#fff' : '#94a3b8',
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
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

export default AdminDashboardLayout;
