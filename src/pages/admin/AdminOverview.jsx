import React, { useState, useEffect } from 'react';
import { Users, MapPin, Star, Map, Camera, Layers, ShieldCheck, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { adminApi } from '../../api/adminApi';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system dashboard metrics..." />;
  if (!stats) return <div>Failed to load admin stats.</div>;

  return (
    <div>
      {/* Admin Welcome */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'var(--bg-dark-surface)', color: '#fff', borderColor: 'var(--border-dark)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          System Administration Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Real-time platform statistics, user management, content moderation, and destination controls
        </p>
      </div>

      {/* 4 Counter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Users</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <MapPin size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalDestinations}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Destinations</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Star size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalReviews}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Reviews</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Map size={26} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalItineraries}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Itineraries</div>
          </div>
        </div>

      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* Recent Registered Users */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Registered Users</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.recentUsers?.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Destinations Summary */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Rated Destinations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.popularDestinations?.slice(0, 5).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{d.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.state}, {d.country}</div>
                </div>
                <RatingStars rating={d.rating} size={14} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* System Quick Stats Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div><strong>Total Attractions:</strong> {stats.totalAttractions}</div>
        <div><strong>Total Categories:</strong> {stats.totalCategories}</div>
        <div><strong>API Status:</strong> <span style={{ color: 'var(--accent)', fontWeight: 700 }}>● Online (200 OK)</span></div>
        <div><strong>Database Engine:</strong> Spring Data JPA / MySQL / H2</div>
      </div>
    </div>
  );
};

export default AdminOverview;
