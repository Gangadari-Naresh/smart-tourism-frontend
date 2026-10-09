import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User, LogOut, LayoutDashboard, Sparkles, Heart, Map, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, height: '70px', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Compass size={22} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Wanderlust
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ fontWeight: isActive('/') ? 700 : 500, color: isActive('/') ? 'var(--primary)' : 'var(--text-main)' }}>
            Home
          </Link>
          <Link to="/destinations" style={{ fontWeight: isActive('/destinations') ? 700 : 500, color: isActive('/destinations') ? 'var(--primary)' : 'var(--text-main)' }}>
            Destinations
          </Link>
          <Link to="/attractions" style={{ fontWeight: isActive('/attractions') ? 700 : 500, color: isActive('/attractions') ? 'var(--primary)' : 'var(--text-main)' }}>
            Attractions
          </Link>
          <Link to="/recommendations" style={{ fontWeight: isActive('/recommendations') ? 700 : 500, color: isActive('/recommendations') ? 'var(--primary)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} /> Recommendations
          </Link>
          <Link to="/about" style={{ fontWeight: isActive('/about') ? 700 : 500, color: isActive('/about') ? 'var(--primary)' : 'var(--text-main)' }}>
            About
          </Link>
        </div>

        {/* Auth / Profile Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="btn btn-outline btn-sm">
                  <Shield size={16} /> Admin Portal
                </Link>
              ) : (
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  <LayoutDashboard size={16} /> User Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Logout">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
