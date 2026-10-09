import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { recommendationApi } from '../../api/recommendationApi';
import { useAuth } from '../../context/AuthContext';

const SmartRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  const fetchRecs = async () => {
    try {
      const data = await recommendationApi.getUserRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const updated = await recommendationApi.generate();
      setRecommendations(updated);
    } catch (err) {
      console.error("Error recalculating recommendations:", err);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating your personalized travel recommendations..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Smart Destination Recommendations</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Personalized matching algorithm based on your profile preference ({user?.travelPreference} & {user?.budgetPreference} budget)
          </p>
        </div>

        <button onClick={handleRecalculate} disabled={recalculating} className="btn btn-accent">
          <Sparkles size={16} /> Recalculate Recommendation Scores
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Recommendations Calculated Yet</h3>
          <button onClick={handleRecalculate} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Generate Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {recommendations.map((rec) => (
            <div key={rec.id} className="glass-card card-hover" style={{ padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={rec.destination?.imageUrl}
                alt={rec.destination?.name}
                style={{ width: '160px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
              />

              <div style={{ flexGrow: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{rec.destination?.name}</h3>
                  <span style={{
                    background: rec.score >= 85 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--primary)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: '800',
                    fontSize: '1rem',
                    boxShadow: '0 2px 10px rgba(16,185,129,0.3)'
                  }}>
                    {rec.score}% Match Score
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {rec.destination?.city}, {rec.destination?.state} • {rec.destination?.categoryName} • {rec.destination?.budget} Budget
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--accent-hover)', fontWeight: 600 }}>
                  <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {rec.reason || 'High compatibility match with your travel profile.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
