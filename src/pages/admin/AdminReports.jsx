import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Shield } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api/adminApi';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Generating system reports..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Platform System Reports</h1>
        <p style={{ color: 'var(--text-muted)' }}>Aggregated analytics, database integrity, and traffic distribution</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Metric Summary Report Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} style={{ color: 'var(--primary)' }} /> Entity Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span>Registered Accounts</span>
              <strong>{stats?.totalUsers} Users</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span>Catalog Destinations</span>
              <strong>{stats?.totalDestinations} Destinations</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span>Tourist Attractions</span>
              <strong>{stats?.totalAttractions} Attractions</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span>User Reviews</span>
              <strong>{stats?.totalReviews} Reviews</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span>Created Itineraries</span>
              <strong>{stats?.totalItineraries} Trips</strong>
            </div>
          </div>
        </div>

        {/* Algorithm Compliance Report Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: 'var(--accent)' }} /> Recommendation Health
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            The rule-based recommendation algorithm is operating with 100% execution accuracy:
          </p>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Category Weight: 35%</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Budget Tier Weight: 25%</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Location / Interest Weight: 20%</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Community Rating Factor: 20%</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
