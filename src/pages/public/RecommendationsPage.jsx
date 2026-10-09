import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { recommendationApi } from '../../api/recommendationApi';
import { categoryApi } from '../../api/categoryApi';
import { useAuth } from '../../context/AuthContext';

const RecommendationsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Preference Inputs
  const [category, setCategory] = useState(user?.travelPreference || 'Beaches');
  const [budget, setBudget] = useState(user?.budgetPreference || 'Medium');
  const [location, setLocation] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(['Water sports', 'Heritage']);
  const [durationDays, setDurationDays] = useState(3);

  const interestOptions = ['Water sports', 'Heritage', 'Palaces', 'Snow', 'Hill view', 'Spiritual ghats', 'Backwaters', 'Shopping', 'Street food'];

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const cats = await categoryApi.getAll();
        setCategories(cats);

        if (isAuthenticated) {
          const userRecs = await recommendationApi.getUserRecommendations();
          setRecommendations(userRecs);
        } else {
          // Generate public guest recommendation sample
          const recs = await recommendationApi.generate({ category, budget, preferredLocation: location });
          setRecommendations(recs);
        }
      } catch (err) {
        console.error("Error loading recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [isAuthenticated]);

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to generate personalized recommendations saved to your dashboard!");
      navigate('/login');
      return;
    }
    setGenerating(true);
    try {
      const results = await recommendationApi.generate({
        category,
        budget,
        preferredLocation: location,
        interests: selectedInterests,
        durationDays: parseInt(durationDays)
      });
      setRecommendations(results);
    } catch (err) {
      console.error("Error generating recommendations:", err);
      alert("Failed to generate recommendations.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-accent" style={{ marginBottom: '1rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} /> Rule-Based Recommendation Algorithm
          </span>
          <h1 className="section-title">Smart Tourism Recommendations</h1>
          <p className="section-subtitle">
            Input your preferences below to calculate match scores based on Category (35%), Budget (25%), Interests (20%), and Ratings (20%).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column: Interactive Preferences Form */}
          <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <Sliders size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Custom Travel Questionnaire</h3>
            </div>

            <form onSubmit={handleGenerate}>
              {/* Category Preference */}
              <div className="form-group">
                <label className="form-label">Preferred Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Budget Preference */}
              <div className="form-group">
                <label className="form-label">Budget Preference</label>
                <select className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)}>
                  <option value="Low">Low Budget (Backpacker)</option>
                  <option value="Medium">Medium Budget (Standard)</option>
                  <option value="High">High Budget (Comfort)</option>
                  <option value="Luxury">Luxury (Resort & Villas)</option>
                </select>
              </div>

              {/* Location Preference */}
              <div className="form-group">
                <label className="form-label">Preferred State / Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Goa, Rajasthan, Kerala..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Specific Interests Tags */}
              <div className="form-group">
                <label className="form-label">Interests & Activities</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {interestOptions.map(interest => {
                    const selected = selectedInterests.includes(interest);
                    return (
                      <span
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: selected ? 'var(--primary)' : 'var(--bg-main)',
                          color: selected ? '#fff' : 'var(--text-main)',
                          border: '1px solid var(--border-light)',
                          transition: 'var(--transition)'
                        }}
                      >
                        {interest} {selected && '✓'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Trip Duration */}
              <div className="form-group">
                <label className="form-label">Trip Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  className="form-control"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                />
              </div>

              <button type="submit" disabled={generating} className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                <Sparkles size={18} /> Calculate Match Scores
              </button>
            </form>
          </div>

          {/* Right Column: Recommendations Results List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recommended For You</h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Top Matches</span>
            </div>

            {loading || generating ? (
              <LoadingSpinner message="Calculating matching scores..." />
            ) : recommendations.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>No Recommendations Generated Yet</h3>
                <p style={{ color: 'var(--text-muted)' }}>Fill out your preferences on the left and click calculate!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {recommendations.slice(0, 5).map((rec, index) => (
                  <div key={rec.id || index} className="glass-card card-hover" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    {/* Destination Image */}
                    <img
                      src={rec.destination?.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                      alt={rec.destination?.name}
                      style={{ width: '130px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                    />

                    {/* Destination Info & Score */}
                    <div style={{ flexGrow: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{rec.destination?.name}</h4>
                        <span style={{
                          background: rec.score >= 85 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--primary)',
                          color: '#fff',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontWeight: '800',
                          fontSize: '0.9rem'
                        }}>
                          {rec.score}% Match
                        </span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {rec.destination?.city}, {rec.destination?.state} • {rec.destination?.budget} Budget
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--accent-hover)', fontWeight: 600 }}>
                        <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {rec.reason || 'High category & budget alignment match.'}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
